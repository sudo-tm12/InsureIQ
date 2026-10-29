import { NextResponse } from 'next/server'
import { enquiryLeadSchema, normalizeSaPhone, type EnquiryLeadData } from '@/lib/validations'
import { rateLimitPersistent } from '@/server/http/rate-limit'
import { readJsonPost } from '@/server/http/json-post'
import { CONSENT_POLICY_VERSION, storeLead, type EnquiryLead } from '@/server/leads/store'
import { sendEnquiryNotificationEmail } from '@/server/leads/notifications'

export const runtime = 'nodejs'

function toEnquiryLead(data: EnquiryLeadData, consentAt: string): EnquiryLead {
  const shared = {
    kind: 'enquiry' as const,
    source: data.source,
    phone: normalizeSaPhone(data.phone) ?? data.phone,
    loanType: data.loanType,
    consentAt,
    policyVersion: CONSENT_POLICY_VERSION,
  }
  if (data.source === 'contact-form') {
    return {
      ...shared,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      loanAmount: data.loanAmount,
      message: data.message?.trim() || null,
    }
  }
  return { ...shared, name: data.name, email: null, loanAmount: null, message: null }
}

/**
 * Enquiry capture for the contact form and the CTA quick-quote banner:
 * validate (incl. POPIA consent), store encrypted with the consent timestamp,
 * and notify the leads inbox. No PII is ever logged.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const input = await readJsonPost(request)
  if (!input.ok) return input.response
  const body = input.body

  const limit = await rateLimitPersistent('leads', request, 5, 60 * 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSeconds) } },
    )
  }


  const parsed = enquiryLeadSchema.safeParse(body)
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
