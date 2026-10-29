/**
 * Request guard for the public JSON POST endpoints (quote, leads, newsletter).
 *
 * - Same-origin only: browsers send Sec-Fetch-Site (or Origin), so another
 *   website cannot post leads — with forged POPIA consent — from a visitor's
 *   browser. A text/plain cross-site "simple request" needs no CORS
 *   preflight, which is why the Content-Type check alone is not enough.
 * - application/json only, and bodies are capped well below anything a
 *   real form sends, so oversized payloads are refused before parsing.
 */
import { NextResponse } from 'next/server'

/** Largest legitimate payload (a 10-account quote with lead details) is ~3 KB. */
const MAX_BODY_BYTES = 32 * 1024

export type JsonPostResult =
  | { ok: true; body: unknown }
  | { ok: false; response: NextResponse }

function reject(status: number, error: string): JsonPostResult {
  return { ok: false, response: NextResponse.json({ error }, { status }) }
}

function isSameOrigin(request: Request): boolean {
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite) return fetchSite === 'same-origin'
  // Older browsers: fall back to the Origin header, which every browser
  // sends on POST. Non-browser clients without either are refused.
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    return new URL(origin).host === new URL(request.url).host
  } catch {
    return false
  }
}

export async function readJsonPost(request: Request): Promise<JsonPostResult> {
  if (!isSameOrigin(request)) return reject(403, 'Forbidden.')

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return reject(415, 'Unsupported content type.')
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0)
  if (declaredLength > MAX_BODY_BYTES) return reject(413, 'Request too large.')

  let text: string
  try {
    text = await request.text()
  } catch {
    return reject(400, 'Invalid request body.')
  }
  // Content-Length can be absent (chunked) or wrong: check what arrived.
  if (Buffer.byteLength(text) > MAX_BODY_BYTES) return reject(413, 'Request too large.')

  try {
    return { ok: true, body: JSON.parse(text) as unknown }
  } catch {
    return reject(400, 'Invalid request body.')
  }
}
