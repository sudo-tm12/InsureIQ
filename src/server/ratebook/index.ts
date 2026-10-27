/**
 * Server-only rate book.
 *
 * ratebook.enc is AES-256-GCM ciphertext (see scripts/ratebook/import_rates.py).
 * The key lives in the RATEBOOK_KEY env var and never reaches the client.
 * Nothing in this module may be imported from a client component — rates must
 * never enter the browser bundle.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { createDecipheriv, timingSafeEqual } from 'node:crypto'

const MAGIC = Buffer.from('IQRB', 'ascii')
const HEADER_BYTES = MAGIC.length + 1 + 12 + 16 // magic + version + iv + tag

export class RateBookError extends Error {}

interface RateBookFile {
  importedAt: string
  source: string
  providers: Array<{ name: string; rate: number }>
}

let cache: Map<string, number> | null = null

function decryptRateBook(): RateBookFile {
  const keyBase64 = process.env.RATEBOOK_KEY?.trim()
  if (!keyBase64) {
    throw new RateBookError('RATEBOOK_KEY is not configured')
  }
  const key = Buffer.from(keyBase64, 'base64')
  if (key.length !== 32) {
    throw new RateBookError('RATEBOOK_KEY must decode to 32 bytes')
  }

  const blob = readFileSync(path.join(process.cwd(), 'src', 'server', 'ratebook', 'ratebook.enc'))
  if (blob.length < HEADER_BYTES || !timingSafeEqual(blob.subarray(0, MAGIC.length), MAGIC)) {
    throw new RateBookError('ratebook.enc is malformed')
  }
  const version = blob[MAGIC.length]
  if (version !== 1) {
    throw new RateBookError(`Unsupported rate book version: ${version}`)
  }

  const iv = blob.subarray(MAGIC.length + 1, MAGIC.length + 1 + 12)
  const tag = blob.subarray(MAGIC.length + 13, HEADER_BYTES)
  const ciphertext = blob.subarray(HEADER_BYTES)

  try {
    const decipher = createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(tag)
    decipher.setAAD(MAGIC)
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()])
    return JSON.parse(plaintext.toString('utf-8')) as RateBookFile
  } catch {
    throw new RateBookError('ratebook.enc failed to decrypt (wrong key or corrupted file)')
  }
}

/** Provider name (exact) → estimated current rate in hundredths (3.40 → 340). */
function load(): Map<string, number> {
  if (cache) return cache
  const book = decryptRateBook()
  cache = new Map(book.providers.map((p) => [p.name, Math.round(p.rate * 100)]))
  return cache
}

/** For tests / tooling: drop the memoised decrypted copy. */
export function clearRateBookCache(): void {
  cache = null
}

/** Exact provider lookup. Returns the rate in hundredths, or null. */
export function findRateHundredths(provider: string): number | null {
  return load().get(provider.trim()) ?? null
}

/** Resolve several providers at once; unknown names come back in `missing`. */
export function resolveRates(providers: string[]): {
  resolved: Array<{ provider: string; rateHundredths: number }>
  missing: string[]
} {
  const book = load()
  const resolved: Array<{ provider: string; rateHundredths: number }> = []
  const missing: string[] = []
  for (const provider of providers) {
    const rateHundredths = book.get(provider.trim())
    if (rateHundredths === undefined) missing.push(provider)
    else resolved.push({ provider, rateHundredths })
  }
  return { resolved, missing }
}

/**
 * Search-as-you-type for the provider combobox.
 * Case-insensitive; prefix matches rank above substring matches.
 * Returns NAMES ONLY — rate values never leave this module.
 */
export function searchProviders(query: string, limit = 8): string[] {
  const needle = query.trim().toLowerCase()
  if (needle.length < 2) return []
  const prefix: string[] = []
  const contains: string[] = []
  load().forEach((_rate, name) => {
    const haystack = name.toLowerCase()
    const at = haystack.indexOf(needle)
    if (at === 0) prefix.push(name)
    else if (at > 0) contains.push(name)
  })
  return prefix.concat(contains).slice(0, limit)
}
