/**
 * Encrypted lead store (server-only) — public interface.
 *
 * POPIA posture: everything identifying is AES-256-GCM encrypted before it
 * touches any storage; only a random id and a timestamp exist in the clear.
 *
 * Backends:
 * - Neon / Vercel Postgres when DATABASE_URL is set (production — the Vercel
 *   filesystem is ephemeral and must never hold leads).
 * - Encrypted JSONL file otherwise (local development).
 */
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import type { QuoteResult } from '@/lib/quote/savings'
import type { LoanType } from '@/lib/validations'
import { storeLeadInFile, readLeadFromFile } from './file-store'
import { storeLeadInPostgres, readLeadFromPostgres } from './postgres-store'

const MAGIC = Buffer.from('IQLD', 'ascii')

/** Privacy Policy version the visitor consented to — stored as consent evidence. */
export const CONSENT_POLICY_VERSION = 'privacy-policy-2026-01'

interface ConsentEvidence {
  consentAt: string
  policyVersion: string
}

/** Savings calculator lead — includes the SA ID number, so it is the most sensitive kind. */
export interface QuoteLead extends ConsentEvidence {
  kind: 'quote'
  firstName: string
  lastName: string
  idNumber: string
  email: string
  phone: string
  quote: QuoteResult
}

export type EnquirySource = 'contact-form' | 'cta-banner'

/** Contact form or CTA banner enquiry. The banner collects no email or amount. */
export interface EnquiryLead extends ConsentEvidence {
  kind: 'enquiry'
  source: EnquirySource
  name: string
  email: string | null
  phone: string
  loanType: LoanType
  loanAmount: string | null
  message: string | null
}

export type LeadPayload = QuoteLead | EnquiryLead

/** Records sealed before `kind` existed are all savings-quote leads. */
type LegacyQuoteLead = Omit<QuoteLead, 'kind'>

export interface StoredLead {
  id: string
  createdAt: string
  /** AES-256-GCM envelope over the JSON payload: iv || tag || ciphertext, base64. */
  sealed: string
}

export function leadsKey(): Buffer {
  const keyBase64 = (process.env.LEADS_KEY ?? process.env.RATEBOOK_KEY)?.trim()
  if (!keyBase64) throw new Error('LEADS_KEY is not configured')
  const key = Buffer.from(keyBase64, 'base64')
  if (key.length !== 32) throw new Error('LEADS_KEY must decode to 32 bytes')
  return key
}

export function seal(payload: LeadPayload): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', leadsKey(), iv)
  cipher.setAAD(MAGIC)
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf-8'),
    cipher.final(),
  ])
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString('base64')
}

export function unseal(sealed: string): LeadPayload {
  const raw = Buffer.from(sealed, 'base64')
  const iv = raw.subarray(0, 12)
  const tag = raw.subarray(12, 28)
  const ciphertext = raw.subarray(28)
  const decipher = createDecipheriv('aes-256-gcm', leadsKey(), iv)
  decipher.setAAD(MAGIC)
  decipher.setAuthTag(tag)
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
  const payload = JSON.parse(plaintext.toString('utf-8')) as LeadPayload | LegacyQuoteLead
  return 'kind' in payload ? payload : { ...payload, kind: 'quote' }
}

/** POPIA retention window in months (default 24). */
export function retentionMonths(): number {
  return Number(process.env.LEADS_RETENTION_MONTHS ?? '24')
}

function postgresEnabled(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim())
}

export async function storeLead(payload: LeadPayload): Promise<{ id: string; createdAt: string }> {
  return postgresEnabled() ? storeLeadInPostgres(payload) : storeLeadInFile(payload)
}

export async function readLead(id: string): Promise<LeadPayload | null> {
  return postgresEnabled() ? readLeadFromPostgres(id) : readLeadFromFile(id)
}
