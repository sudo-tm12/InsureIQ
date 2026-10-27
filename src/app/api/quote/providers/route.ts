import { NextResponse } from 'next/server'
import { searchProviders, RateBookError } from '@/server/ratebook'
import { getClientIp, rateLimit } from '@/server/http/rate-limit'

export const runtime = 'nodejs'

/**
 * Provider autocomplete — returns NAMES ONLY (top 8, min 2 chars).
 * Rates never leave the server; requests are rate-limited to slow enumeration.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`providers:${getClientIp(request)}`, 20, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  const query = new URL(request.url).searchParams.get('q') ?? ''
  if (query.trim().length < 2) {
    return NextResponse.json({ providers: [] })
  }

  try {
    return NextResponse.json(
      { providers: searchProviders(query, 8) },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof RateBookError) {
      return NextResponse.json(
        { error: 'Estimator temporarily unavailable.' },
        { status: 503 },
      )
    }
    throw error
  }
}
