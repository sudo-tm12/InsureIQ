import { NextResponse } from 'next/server'
import { quoteCalculationSchema } from '@/lib/validations'
import { calculateSavings } from '@/lib/quote/savings'
import { resolveRates, RateBookError } from '@/server/ratebook'
import { getClientIp, rateLimit } from '@/server/http/rate-limit'

export const runtime = 'nodejs'

/**
 * Compute the savings quote. All rate maths happens here, server-side;
 * the response contains Rand amounts only — never rate values.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`calculate:${getClientIp(request)}`, 30, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = quoteCalculationSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Please check your account details.', issues: parsed.error.issues },
      { status: 422 },
    )
  }

  try {
    const { resolved, missing } = resolveRates(
      parsed.data.accounts.map((account) => account.provider),
    )
    if (missing.length > 0) {
      return NextResponse.json(
        { error: 'One or more providers are not recognised. Please pick from the list.' },
        { status: 422 },
      )
    }

    const quote = calculateSavings(
      parsed.data.accounts.map((account) => ({
        provider: account.provider,
        accountNumber: account.accountNumber,
        balance: account.balance,
        creditType: account.creditType,
        currentPremiumCents: account.currentPremium ? account.currentPremium * 100 : undefined,
      })),
      resolved,
      { yearsRemaining: parsed.data.yearsRemaining },
    )
    return NextResponse.json(quote, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if (error instanceof RateBookError) {
      return NextResponse.json(
        { error: 'Estimator temporarily unavailable. Please try again shortly.' },
        { status: 503 },
      )
    }
    console.error('Quote calculation failed')
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
