/**
 * Quote emails (server-only), sent through Resend.
 * POPIA: the leads-inbox notification carries the MASKED id number only;
 * the full record sits behind a signed, expiring link.
 * Every interpolated value is HTML-escaped — names and account numbers are
 * free text typed by the visitor.
 */
import { maskIdNumber } from '@/lib/validations'
import { escapeHtml, formatCents } from '@/lib/utils'
import type { QuoteResult } from '@/lib/quote/savings'
import { creditTypeLabel } from '@/lib/quote/savings'
import { leadsInbox, sendEmail, type EmailResult } from '@/server/email/resend'

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
  /** The same PDF the client receives (ID number masked), for the team to keep or forward. */
  pdf: Uint8Array
}

function quoteTableRows(quote: QuoteResult): string {
  return quote.rows
    .map(
      (row) => `
        <tr>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${escapeHtml(row.provider)}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${escapeHtml(creditTypeLabel(row.creditType))}</td>
          <td style="padding:6px 10px;border-bottom:1px solid #e8edf5;">${escapeHtml(row.accountNumber ?? '—')}</td>
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

function pdfAttachment(pdf: Uint8Array): { filename: string; content: string } {
  return { filename: 'InsurIQ-savings-quote.pdf', content: Buffer.from(pdf).toString('base64') }
}

function yearsLabel(years: number): string {
  return years === 1 ? 'year' : 'years'
}

export async function sendClientQuoteEmail(input: ClientQuoteEmailInput): Promise<EmailResult> {
  const { quote } = input
  return sendEmail({
    to: input.to,
    subject: 'Your personal InsurIQ savings quote',
    html: `
      <div style="background:#071840;padding:20px 28px;">
        <span style="font-family:Arial,sans-serif;font-size:18px;font-weight:bold;color:#fff;">InsurIQ</span>
        <span style="font-family:Arial,sans-serif;font-size:11px;color:#5DCDE6;margin-left:10px;">Credit life insurance that finally makes sense.</span>
      </div>
      <div style="padding:28px;font-family:Arial,sans-serif;color:#1c2b4a;">
        <h1 style="font-size:20px;margin:0 0 6px;">Your savings quote is ready</h1>
        <p style="font-size:13px;color:#5a6b85;margin:0 0 20px;">Quote date: ${escapeHtml(input.quoteDate)} · Prepared for ${escapeHtml(`${input.firstName} ${input.lastName}`)}</p>
        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="background:#f2f6fc;padding:14px 18px;">
              <div style="font-size:11px;color:#5a6b85;">You could save</div>
              <div style="font-size:26px;font-weight:bold;color:#0B2D78;">${formatCents(quote.summary.savingMonthlyCents)} <span style="font-size:13px;font-weight:normal;">per month</span></div>
              <div style="font-size:12px;color:#5a6b85;">${formatCents(quote.summary.savingAnnualCents)} a year</div>
              <div style="font-size:12px;color:#5a6b85;">Roughly ${formatCents(quote.summary.termSavingCents)} over the next ${quote.summary.yearsRemaining} ${yearsLabel(quote.summary.yearsRemaining)}</div>
            </td>
          </tr>
        </table>
        ${quoteTable(quote)}
        <p style="font-size:13px;margin-top:22px;">Your full quote is attached as a PDF. One of our advisors will be in touch to finalise your personalised cover.</p>
        ${FOOTER}
      </div>`,
    attachments: [pdfAttachment(input.pdf)],
  })
}

export async function sendLeadNotificationEmail(
  input: LeadNotificationEmailInput,
): Promise<EmailResult> {
  const { quote } = input
  return sendEmail({
    to: leadsInbox(),
    subject: `New quote lead: ${input.firstName} ${input.lastName} — saves ${formatCents(quote.summary.savingMonthlyCents)}/month`,
    html: `
      <div style="padding:24px;font-family:Arial,sans-serif;color:#1c2b4a;">
        <h1 style="font-size:18px;margin:0 0 16px;">New savings quote lead</h1>
        <table cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Name</td><td style="padding:4px 0;font-weight:bold;">${escapeHtml(`${input.firstName} ${input.lastName}`)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">ID number</td><td style="padding:4px 0;font-weight:bold;">${escapeHtml(maskIdNumber(input.idNumber))}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Email</td><td style="padding:4px 0;">${escapeHtml(input.email)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Cell</td><td style="padding:4px 0;">${escapeHtml(input.phone)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Consent recorded</td><td style="padding:4px 0;">${escapeHtml(input.consentAt)}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#5a6b85;">Savings</td><td style="padding:4px 0;font-weight:bold;color:#0B2D78;">${formatCents(quote.summary.savingMonthlyCents)}/month · ${formatCents(quote.summary.savingAnnualCents)}/year · ${formatCents(quote.summary.termSavingCents)} over ${quote.summary.yearsRemaining} ${yearsLabel(quote.summary.yearsRemaining)}</td></tr>
        </table>
        <h2 style="font-size:14px;margin:22px 0 8px;">Accounts</h2>
        ${quoteTable(quote)}
        <p style="font-size:12px;margin-top:22px;">
          <a href="${escapeHtml(input.recordUrl)}" style="background:#0B2D78;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none;font-weight:bold;">View full lead record</a>
        </p>
        <p style="font-size:11px;color:#7a8699;">The client's PDF quote is attached (ID number masked). The record link shows the full ID number and expires in 24 hours. Access is granted for POPIA-compliant follow-up only.</p>
      </div>`,
    attachments: [pdfAttachment(input.pdf)],
  })
}
