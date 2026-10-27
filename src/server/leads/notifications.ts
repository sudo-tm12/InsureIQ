/**
 * Leads-inbox notifications for website enquiries (server-only).
 * Savings-quote leads have their own richer email in server/quote/email.ts.
 * Every interpolated value is HTML-escaped — it is all visitor-typed text.
 */
import { escapeHtml } from '@/lib/utils'
import { loanTypeLabel } from '@/lib/validations'
import { leadsInbox, sendEmail, type EmailResult } from '@/server/email/resend'
import type { EnquiryLead, EnquirySource } from './store'

const SOURCE_LABELS: Record<EnquirySource, string> = {
  'contact-form': 'Contact form',
  'cta-banner': 'Quick quote banner',
}

function detailRows(rows: Array<[label: string, value: string | null]>): string {
  return rows
    .filter((row): row is [string, string] => row[1] !== null)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#5a6b85;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
}

function notification(heading: string, rows: Array<[string, string | null]>): string {
  return `
    <div style="padding:24px;font-family:Arial,sans-serif;color:#1c2b4a;">
      <h1 style="font-size:18px;margin:0 0 16px;">${escapeHtml(heading)}</h1>
      <table cellpadding="0" cellspacing="0" style="font-size:13px;border-collapse:collapse;">
        ${detailRows(rows)}
      </table>
      <p style="font-size:11px;color:#7a8699;margin-top:22px;">Consent was given on the website. Use these details for POPIA-compliant follow-up only.</p>
    </div>`
}

export async function sendEnquiryNotificationEmail(lead: EnquiryLead): Promise<EmailResult> {
  const source = SOURCE_LABELS[lead.source]
  return sendEmail({
    to: leadsInbox(),
    subject: `New enquiry: ${lead.name} (${source})`,
    html: notification('New website enquiry', [
      ['Source', source],
      ['Name', lead.name],
      ['Email', lead.email],
      ['Phone', lead.phone],
      ['Loan type', loanTypeLabel(lead.loanType)],
      ['Loan amount', lead.loanAmount],
      ['Message', lead.message],
      ['Consent recorded', `${lead.consentAt} · ${lead.policyVersion}`],
    ]),
  })
}
