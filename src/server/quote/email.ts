/**
 * Resend transactional email (server-only). REST via fetch — no SDK needed.
 * POPIA: the leads-inbox notification carries the MASKED id number only;
 * the full record sits behind a signed, expiring link.
 */
import { maskIdNumber } from '@/lib/validations'
import { formatCents } from '@/lib/utils'
import type { QuoteResult } from '@/lib/quote/savings'
import { creditTypeLabel } from '@/lib/quote/savings'

const RESEND_URL = 'https://api.resend.com/emails'

export interface EmailResult {
  sent: boolean
  reason?: string
}

export interface ClientQuoteEmailInput {
  to: string
  firstName: string
  lastName: string
  quote: QuoteResult
  quoteDate: string
  pdf: Uint8Array
}

export interface LeadNotificationEmailInput {
  firstName: string
  lastName: string
  idNumber: string
  email: string
  phone: string
  consentAt: string
  quote: QuoteResult
  recordUrl: string
}

function fromAddress(): string {
  return process.env.RESEND_FROM ?? 'InsurIQ <quotes@insuriq.co.za>'
}

async function send(message: Record<string, unknown>): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not configured' }
  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    if (!response.ok) {
      // Log status only — never PII or provider payloads.
      console.error(`Resend error: ${response.status}`)
      return { sent: false, reason: `Resend responded ${response.status}` }
    }
    return { sent: true }
  } catch {
    console.error('Resend request failed')
    return { sent: false, reason: 'Resend request failed' }
  }
}

function quoteTableRows(quote: QuoteResult): string {
  return quote.rows
    .map(
      (row) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${row.provider}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${creditTypeLabel(row.creditType)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${row.accountNumber ?? '—'}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;text-align:right;">${formatCents(row.balanceCents)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;text-align:right;">${formatCents(row.currentMonthlyCents)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;text-align:right;">${formatCents(row.newMonthlyCents)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;text-align:right;font-weight:bold;color:#0B2D78;">${formatCents(row.savingMonthlyCents)}</td>
        </tr>`,
    )
    .join('')
}

function quoteTable(quote: QuoteResult): string {
  return `
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      <thead>
        <tr style="background:#0B2D78;color:#fff;">
          <th style="padding:8px 10px;text-align:left;">Account</th>
          <th style="padding:8px 10px;text-align:left;">Type</th>
          <th style="padding:8px 10px;text-align:left;">Account no.</th>
          <th style="padding:8px 10px;text-align:right;">Outstanding</th>
          <th style="padding:8px 10px;text-align:right;">Current est./mo</th>
          <th style="padding:8px 10px;text-align:right;">InsurIQ/mo</th>
          <th style="padding:8px 10px;text-align:right;">Saving/mo</th>
        </tr>
      </thead>
      <tbody>
        ${quoteTableRows(quote)}
        <tr style="background:#f2f6fc;font-weight:bold;">
          <td style="padding:8px 10px;">Total</td>
          <td></td>
          <td></td>
          <td style="padding:8px 10px;text-align:right;">${formatCents(quote.summary.totalBalanceCents)}</td>
          <td style="padding:8px 10px;text-align:right;">${formatCents(quote.summary.currentMonthlyCents)}</td>
          <td style="padding:8px 10px;text-align:right;">${formatCents(quote.summary.newMonthlyCents)}</td>
          <td style="padding:8px 10px;text-align:right;color:#0B2D78;">${formatCents(quote.summary.savingMonthlyCents)}</td>
        </tr>
      </tbody>
    </table>`
}

const FOOTER = `
  <p style="font-family:Arial,sans-serif;font-size:11px;color:#7a8699;margin-top:24px;">
    InsurIQ is an Authorised Financial Services Provider. Estimates are indicative and
    based on the information provided; your final premium is confirmed after assessment.
    We process your information in accordance with POPIA and our
    <a href="https://www.insuriq.co.za/privacy-policy" style="color:#1A5FBF;">Privacy Policy</a>.
  </p>`

export async function sendClientQuoteEmail(input: ClientQuoteEmailInput): Promise<EmailResult> {
  const { quote } = input
  return send({
    from: fromAddress(),
    to: input.to,
    subject: 'Your personal InsurIQ savings quote',
    html: `
      <div style="background:#071840;padding:20px 28px;">
        <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#fff;">InsurIQ</span>
        <span style="font-family:Arial,sans-serif;font-size:11px;color:#5DCDE6;margin-left:10px;">Credit life insurance that finally makes sense.</span>
      </div>
      <div style="padding:28px;font-family:Arial,sans-serif;color:#1c2b4a;">
        <h1 style="font-size:20px;margin:0 0 6px;">Your savings quote is ready</h1>
        <p style="font-size:13px;color:#5a6b85;margin:0 0 20px;">Quote date: ${input.quoteDate} · Prepared for ${input.firstName} ${input.lastName}</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#f2f6fc;padding:14px 18px;">
              <div style="font-size:11px;color:#5a6b85;">You could save</div>
              <div style="font-size:26px;font-weight:bold;color:#0B2D78;">${formatCents(quote.summary.savingMonthlyCents)} <span style="font-size:13px;font-weight:normal;">per month</span></div>
              <div style="font-size:12px;color:#5a6b85;">${formatCents(quote.summary.savingAnnualCents)} a year</div>
              <div style="font-size:12px;color:#5a6b85;">Roughly ${formatCents(quote.summary.termSavingCents)} over the next ${quote.summary.yearsRemaining} ${quote.summary.yearsRemaining === 1 ? 'year' : 'years'}</div>
            </td>
          </tr>
        </table>
        ${quoteTable(quote)}
        <p style="font-size:13px;margin-top:22px;">Your full quote is attached as a PDF. One of our advisors will be in touch to finalise your personalised cover.</p>
        ${FOOTER}
      </div>`,
    attachments: [
      {
        filename: 'InsurIQ-savings-quote.pdf',
        content: Buffer.from(input.pdf).toString('base64'),
      },
    ],
  })
}

export async function sendLeadNotificationEmail(
  input: LeadNotificationEmailInput,
): Promise<EmailResult> {
  const { quote } = input
  return send({
    from: fromAddress(),
    to: process.env.LEADS_NOTIFICATION_EMAIL ?? 'leads@insuriq.co.za',
    subject: `New quote lead: ${input.firstName} ${input.lastName} — saves ${formatCents(quote.summary.savingMonthlyCents)}/month`,
    html: `
      <div style="padding:24px;font-family:Arial,sans-serif;color:#1c2b4a;">
        <h1 style="font-size:18px;margin:0 0 16px;">New savings quote lead</h1>
        <table cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Name</td><td style="padding:4px 0;font-weight:bold;">${input.firstName} ${input.lastName}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">ID number</td><td style="padding:4px 0;font-weight:bold;">${maskIdNumber(input.idNumber)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Email</td><td style="padding:4px 0;">${input.email}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Cell</td><td style="padding:4px 0;">${input.phone}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Consent recorded</td><td style="padding:4px 0;">${input.consentAt}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Savings</td><td style="padding:4px 0;font-weight:bold;color:#0B2D78;">${formatCents(quote.summary.savingMonthlyCents)}/month · ${formatCents(quote.summary.savingAnnualCents)}/year · ${formatCents(quote.summary.termSavingCents)} over ${quote.summary.yearsRemaining} ${quote.summary.yearsRemaining === 1 ? 'year' : 'years'}</td></tr>
        </table>
        <h2 style="font-size:14px;margin:22px 0 8px;">Accounts</h2>
        ${quoteTable(quote)}
        <p style="font-size:12px;margin-top:22px;">
          <a href="${input.recordUrl}" style="background:#0B2D78;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">View full lead record</a>
        </p>
        <p style="font-size:11px;color:#7a8699;">The record link shows the full ID number and expires in 24 hours. Access is granted for POPIA-compliant follow-up only.</p>
      </div>`,
  })
}
