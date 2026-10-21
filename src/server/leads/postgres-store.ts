/**
 * Neon / Vercel Postgres lead store (server-only).
 *
 * Requires DATABASE_URL (Neon connection string). The table is created by
 * scripts/leads/schema.sql (run `npm run leads:migrate`). Only the sealed
 * ciphertext is stored — the database never sees PII in the clear.
 */
import { randomUUID } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import {
  retentionMonths,
  seal,
  unseal,
  type LeadPayload,
  type StoredLead,
} from './store'

function sql() {
  const url = process.env.DATABASE_URL?.trim()
  if (!url) throw new Error('DATABASE_URL is not configured')
  return neon(url)
}

export async function storeLeadInPostgres(
  payload: LeadPayload,
): Promise<{ id: string; createdAt: string }> {
  const db = sql()
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
  const rows = await db`SELECT sealed FROM leads WHERE id = ${id}`
  if (rows.length === 0) return null
  return unseal((rows[0] as { sealed: string }).sealed)
}
