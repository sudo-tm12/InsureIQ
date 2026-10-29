/**
 * Rate limiting for the public API.
 *
 * - rateLimit(): in-memory sliding window. On serverless each instance keeps
 *   its own counters, so it only slows bursts; used for the high-frequency,
 *   read-only endpoints (provider search, calculate).
 * - rateLimitPersistent(): one shared counter per client in Postgres, so the
 *   quota holds across instances and cold starts; used for every endpoint that
 *   stores personal information. Falls back to the in-memory limiter when the
 *   database is not configured (local dev) or unreachable.
 *
 * POPIA: client IPs are never stored — only a keyed HMAC of them.
 */
import { createHmac } from 'node:crypto'
import { isDatabaseConfigured, sql, type Sql } from '@/server/db'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  retryAfterSeconds: number
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  if (buckets.size > 5000) {
    buckets.forEach((bucket, k) => {
      if (bucket.resetAt <= now) buckets.delete(k)
    })
  }
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterSeconds: 0 }
  }
  bucket.count += 1
  if (bucket.count > limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfterSeconds: 0 }
}

/** Vercel overwrites X-Forwarded-For with the real client IP, so it can't be spoofed there. */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || 'unknown'
}

function hashedClient(scope: string, ip: string): string | null {
  const keyBase64 = process.env.LEADS_KEY?.trim()
  if (!keyBase64) return null
  const key = createHmac('sha256', Buffer.from(keyBase64, 'base64')).update('rate-limit-v1').digest()
  return `${scope}:${createHmac('sha256', key).update(ip).digest('base64url')}`
}

// Once per server instance. Keep in sync with scripts/leads/schema.sql.
let schemaReady: Promise<void> | null = null

function ensureSchema(db: Sql): Promise<void> {
  schemaReady ??= (async () => {
    await db`
      CREATE TABLE IF NOT EXISTS rate_limits (
        key TEXT PRIMARY KEY,
        count INTEGER NOT NULL,
        reset_at TIMESTAMPTZ NOT NULL
      )
    `
  })().catch((error: unknown) => {
    schemaReady = null
    throw error
  })
  return schemaReady
}

export async function rateLimitPersistent(
  scope: string,
  request: Request,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const ip = getClientIp(request)
  const key = hashedClient(scope, ip)
  if (!key || !isDatabaseConfigured()) return rateLimit(`${scope}:${ip}`, limit, windowMs)

  try {
    const db = sql()
    await ensureSchema(db)
    const windowSeconds = Math.ceil(windowMs / 1000)
    // Atomic upsert: a new or expired window restarts at 1, otherwise +1.
    const rows = (await db`
      INSERT INTO rate_limits (key, count, reset_at)
      VALUES (${key}, 1, now() + make_interval(secs => ${windowSeconds}))
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.reset_at <= now() THEN 1 ELSE rate_limits.count + 1 END,
        reset_at = CASE WHEN rate_limits.reset_at <= now() THEN EXCLUDED.reset_at ELSE rate_limits.reset_at END
      RETURNING count, CEIL(EXTRACT(EPOCH FROM (reset_at - now())))::int AS retry_after
    `) as Array<{ count: number; retry_after: number }>
    // Occasional sweep so expired counters don't accumulate.
    if (Math.random() < 0.02) {
      await db`DELETE FROM rate_limits WHERE reset_at < now() - interval '1 day'`
    }
    const [{ count, retry_after: retryAfter }] = rows
    return count > limit
      ? { ok: false, retryAfterSeconds: Math.max(retryAfter, 1) }
      : { ok: true, retryAfterSeconds: 0 }
  } catch {
    // Never block a real client because the limiter's storage is down.
    console.warn('Rate limiter: database unavailable, using in-memory limits')
    return rateLimit(`${scope}:${ip}`, limit, windowMs)
  }
}
