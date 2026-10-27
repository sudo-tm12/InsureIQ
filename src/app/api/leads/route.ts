import { NextResponse } from 'next/server'
import { contactFormSchema, normalizeSaPhone, type ContactFormData } from '@/lib/validations'
import { getClientIp, rateLimit } from '@/server/http/rate-limit'
import { CONSENT_POLICY_VERSION, storeLead, type EnquiryLead } from '@/server/leads/store'
import { sendEnquiryNotificationEmail } from '@/server/leads/notifications'

export const runtime = 'nodejs'

function toEnquiryLead(data: ContactFormData, consentAt: string): EnquiryLead {
  return {
    kind: 'enquiry',
    source: 'contact-form',
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    phone: normalizeSaPhone(data.phone) ?? data.phone,
    loanType: data.loanType,
    loanAmount: data.loanAmount,
    message: data.message?.trim() || null,
    consentAt,
    policyVersion: CONSENT_POLICY_VERSION,
  }
}

/**
 * Enquiry capture for the contact form: validate (incl. POPIA consent),
 * store encrypted with the consent timestamp, and notify the leads inbox.
 * No PII is ever logged.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const limit = rateLimit(`leads:${getClientIp(request)}`, 5, 60 * 60_000)
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

  const parsed = contactFormSchema.safeParse(body)
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

  try {
    const lead = toEnquiryLead(parsed.data, new Date().toISOString())
    await storeLead(lead)
    // The lead is captured either way; a failed notification is logged inside.
    await sendEnquiryNotificationEmail(lead)
    return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    // Never leak details (PII is in scope) — log the failure class only.
    console.error('Enquiry submission failed')
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
