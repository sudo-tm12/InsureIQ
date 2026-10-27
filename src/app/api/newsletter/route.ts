import { NextResponse } from 'next/server'
import { newsletterSchema } from '@/lib/validations'
import { getClientIp, rateLimit } from '@/server/http/rate-limit'
import { CONSENT_POLICY_VERSION, storeLead, type NewsletterLead } from '@/server/leads/store'
import { sendNewsletterSignupEmail } from '@/server/leads/notifications'

export const runtime = 'nodejs'

/**
 * Footer newsletter sign-up. The email and consent evidence are stored
 * encrypted alongside other leads, and each sign-up is forwarded to the
 * leads inbox so the team can add it to the mailing list. No PII is logged.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`newsletter:${getClientIp(request)}`, 5, 60 * 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const parsed = newsletterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Please check the form and try again.' },
      { status: 422 },
    )
  }

  try {
    const lead: NewsletterLead = {
      kind: 'newsletter',
      email: parsed.data.email,
      consentAt: new Date().toISOString(),
      policyVersion: CONSENT_POLICY_VERSION,
    }
    await storeLead(lead)
    await sendNewsletterSignupEmail(lead)
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    console.error('Newsletter sign-up failed')
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
