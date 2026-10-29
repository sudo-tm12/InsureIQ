import { NextResponse } from 'next/server'
import { quoteLeadSchema } from '@/lib/validations'
import { calculateSavings } from '@/lib/quote/savings'
import { resolveRates, RateBookError } from '@/server/ratebook'
import { rateLimitPersistent } from '@/server/http/rate-limit'
import { readJsonPost } from '@/server/http/json-post'
import { CONSENT_POLICY_VERSION, storeLead } from '@/server/leads/store'
import { signLeadRecordToken } from '@/server/leads/token'
import { generateQuotePdf } from '@/server/quote/pdf'
import { sendClientQuoteEmail, sendLeadNotificationEmail } from '@/server/quote/email'

export const runtime = 'nodejs'

/**
 * Lead capture: validate (incl. SA ID + POPIA consent), generate the PDF
 * quote, store the lead encrypted, and email both copies.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const input = await readJsonPost(request)
  if (!input.ok) return input.response
  const body = input.body

  const limit = await rateLimitPersistent('send', request, 5, 60 * 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }


  const parsed = quoteLeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'Please check the form and try again.',
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 422 },
    )
  }

  // Honeypot: silently accept but store nothing.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true, emailSent: false })
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
    const quoteDate = new Date().toLocaleDateString('en-ZA', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })

    const pdf = await generateQuotePdf({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      idNumber: parsed.data.idNumber,
      quoteDate,
      quote,
    })

    const consentAt = new Date().toISOString()
    const lead = await storeLead({
      kind: 'quote',
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      idNumber: parsed.data.idNumber,
      email: parsed.data.email,
      phone: parsed.data.phone,
      consentAt,
      policyVersion: CONSENT_POLICY_VERSION,
      quote,
    })

    const origin = new URL(request.url).origin
    const recordUrl = `${origin}/api/quote/lead-record?token=${signLeadRecordToken(lead.id)}`

    const [clientEmail, leadEmail] = await Promise.all([
      sendClientQuoteEmail({
        to: parsed.data.email,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        quote,
        quoteDate,
        pdf,
      }),
      sendLeadNotificationEmail({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        idNumber: parsed.data.idNumber,
        email: parsed.data.email,
        phone: parsed.data.phone,
        consentAt,
        quote,
        recordUrl,
        pdf,
      }),
    ])

    return NextResponse.json(
      {
        ok: true,
        // Honest signal for the UI: emails may be unsent in dev or on failure —
        // the lead is captured either way.
        emailSent: clientEmail.sent,
        leadNotified: leadEmail.sent,
        quoteReference: lead.id,
      },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (error) {
    if (error instanceof RateBookError) {
      return NextResponse.json(
        { error: 'Estimator temporarily unavailable. Please try again shortly.' },
        { status: 503 },
      )
    }
    // Never leak details (PII may have been in scope) — log the failure class only.
    console.error('Quote send failed')
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
