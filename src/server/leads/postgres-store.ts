/**
 * Neon / Vercel Postgres lead store (server-only).
 *
 * Requires DATABASE_URL (Neon connection string). The table is created on
 * first use (idempotent), so a fresh database needs no manual migration;
 * `npm run leads:migrate` applies the same schema ahead of time. Only the
 * sealed ciphertext is stored — the database never sees PII in the clear.
 */
import { randomUUID } from 'node:crypto'
import { sql, type Sql } from '@/server/db'
import {
  retentionMonths,
  seal,
  unseal,
  type LeadPayload,
  type StoredLead,
} from './store'

// Once per server instance. Keep in sync with scripts/leads/schema.sql.
let schemaReady: Promise<void> | null = null

function ensureSchema(db: Sql): Promise<void> {
  schemaReady ??= (async () => {
    await db`
      CREATE TABLE IF NOT EXISTS leads (
        id UUID PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL,
        sealed TEXT NOT NULL
      )
    `
    await db`CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at)`
  })().catch((error: unknown) => {
    // Let the next request retry rather than caching a failure.
    schemaReady = null
    throw error
  })
  return schemaReady
}

export async function storeLeadInPostgres(
  payload: LeadPayload,
): Promise<{ id: string; createdAt: string }> {
  const db = sql()
  await ensureSchema(db)
  const record: StoredLead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    sealed: seal(payload),
  }
  await db`
    INSERT INTO leads (id, created_at, sealed)
    VALUES (${record.id}, ${record.createdAt}, ${record.sealed})
  `
  // POPIA retention: opportunistic purge of expired leads.
  const cutoff = new Date(
    Date.now() - retentionMonths() * 30 * 24 * 60 * 60 * 1000,
  ).toISOString()
  await db`DELETE FROM leads WHERE created_at < ${cutoff}`
  return { id: record.id, createdAt: record.createdAt }
}

export async function readLeadFromPostgres(id: string): Promise<LeadPayload | null> {
  const db = sql()
  await ensureSchema(db)
  const rows = await db`SELECT sealed FROM leads WHERE id = ${id}`
  if (rows.length === 0) return null
  return unseal((rows[0] as { sealed: string }).sealed)
}
