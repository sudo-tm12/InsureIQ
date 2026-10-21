/**
 * File-backed lead store — local development only.
 * (Production uses postgres-store.ts; the Vercel filesystem is ephemeral.)
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import {
  retentionMonths,
  seal,
  unseal,
  type LeadPayload,
  type StoredLead,
} from './store'

function leadsFile(): string {
  return process.env.LEADS_FILE ?? path.join(process.cwd(), '.data', 'leads.jsonl')
}

export function storeLeadInFile(payload: LeadPayload): { id: string; createdAt: string } {
  const record: StoredLead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    sealed: seal(payload),
  }
  const file = leadsFile()
  mkdirSync(path.dirname(file), { recursive: true })
  appendFileSync(file, `${JSON.stringify(record)}\n`, 'utf-8')
  purgeExpiredLeads()
  return { id: record.id, createdAt: record.createdAt }
}

export function readLeadFromFile(id: string): LeadPayload | null {
  const file = leadsFile()
  if (!existsSync(file)) return null
  for (const line of readFileSync(file, 'utf-8').split('\n')) {
    if (!line.trim()) continue
    const record = JSON.parse(line) as StoredLead
    if (record.id === id) return unseal(record.sealed)
  }
  return null
}

/** POPIA retention: drop leads older than the configured window. */
function purgeExpiredLeads(): void {
  const file = leadsFile()
  if (!existsSync(file)) return
  const cutoff = Date.now() - retentionMonths() * 30 * 24 * 60 * 60 * 1000
  const kept = readFileSync(file, 'utf-8')
    .split('\n')
    .filter((line) => {
      if (!line.trim()) return true
      const record = JSON.parse(line) as StoredLead
      return new Date(record.createdAt).getTime() >= cutoff
    })
  writeFileSync(file, kept.join('\n'), 'utf-8')
}
