/**
 * Neon / Vercel Postgres connection (server-only), shared by the lead store
 * and the rate limiter. Tables are created on first use by their owners;
 * scripts/leads/schema.sql holds the same schema for `npm run leads:migrate`.
 */
import { neon, type NeonQueryFunction } from '@neondatabase/serverless'

export type Sql = NeonQueryFunction<false, false>

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export function sql(): Sql {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) throw new Error('DATABASE_URL is not configured')
  return neon(url)
}
