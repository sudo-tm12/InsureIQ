/**
 * HMAC-signed, expiring links to a full lead record (server-only).
 * Sent to the leads inbox so consultants can view the unmasked ID number
 * without putting PII into the email itself.
 */
import { createHmac, timingSafeEqual } from 'node:crypto'

const DEFAULT_TTL_HOURS = 24

function key(): Buffer {
  const keyBase64 = (process.env.LEADS_KEY ?? process.env.RATEBOOK_KEY)?.trim()
  if (!keyBase64) throw new Error('LEADS_KEY is not configured')
  return createHmac('sha256', Buffer.from(keyBase64, 'base64'))
    .update('lead-record-token-v1')
    .digest()
}

function sign(value: string): string {
  return createHmac('sha256', key()).update(value).digest('base64url')
}

export function signLeadRecordToken(leadId: string, ttlHours = DEFAULT_TTL_HOURS): string {
  const exp = Date.now() + ttlHours * 60 * 60 * 1000
  const body = `${leadId}.${exp}`
  return `${body}.${sign(body)}`
}

export function verifyLeadRecordToken(token: string): string | null {
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [leadId, expRaw, signature] = parts
  const body = `${leadId}.${expRaw}`
  const expected = Buffer.from(sign(body))
  const actual = Buffer.from(signature)
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null
  if (Number(expRaw) < Date.now()) return null
  return leadId
}
