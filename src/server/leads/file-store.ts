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

// Statically scoped to the .data subfolder so Turbopack's output tracing stays
// scoped to this store's inputs instead of the whole project.
const LEADS_FILE = path.join(process.cwd(), '.data', 'leads.jsonl')

/**
 * One JSONL line → record, or null if unreadable. Tolerates a UTF-8 BOM
 * (Windows PowerShell 5.1 adds one when it creates or clears the file).
 */
function parseRecord(line: string): StoredLead | null {
  const text = line.replace(/^﻿/, '').trim()
  if (!text) return null
  try {
    return JSON.parse(text) as StoredLead
  } catch {
    return null
  }
}

export function storeLeadInFile(payload: LeadPayload): { id: string; createdAt: string } {
  const record: StoredLead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    sealed: seal(payload),
  }
  mkdirSync(path.dirname(LEADS_FILE), { recursive: true })
  appendFileSync(LEADS_FILE, `${JSON.stringify(record)}\n`, 'utf-8')
  purgeExpiredLeads()
  return { id: record.id, createdAt: record.createdAt }
}

export function readLeadFromFile(id: string): LeadPayload | null {
  if (!existsSync(LEADS_FILE)) return null
  for (const line of readFileSync(LEADS_FILE, 'utf-8').split('\n')) {
    const record = parseRecord(line)
    if (record?.id === id) return unseal(record.sealed)
  }
  return null
}

/** POPIA retention: drop leads older than the configured window. */
function purgeExpiredLeads(): void {
  if (!existsSync(LEADS_FILE)) return
  const cutoff = Date.now() - retentionMonths() * 30 * 24 * 60 * 60 * 1000
  const kept = readFileSync(LEADS_FILE, 'utf-8')
    .split('\n')
    .map((line) => line.replace(/^﻿/, '').trim())
    .filter((line) => {
      if (!line) return false
      const record = parseRecord(line)
      // Never destroy a line we cannot read — only drop records proven expired.
      return record === null || new Date(record.createdAt).getTime() >= cutoff
    })
  writeFileSync(LEADS_FILE, kept.length > 0 ? `${kept.join('\n')}\n` : '', 'utf-8')
}
