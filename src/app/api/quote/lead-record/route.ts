import { NextResponse } from 'next/server'
import { verifyLeadRecordToken } from '@/server/leads/token'
import { readLead, type QuoteLead } from '@/server/leads/store'
import { maskIdNumber } from '@/lib/validations'
import { creditTypeLabel } from '@/lib/quote/savings'
import { escapeHtml, formatCents } from '@/lib/utils'

export const runtime = 'nodejs'

/**
 * This page shows a full SA ID number. It runs no script, loads nothing
 * external, can't be framed, never sends its tokened URL as a referrer and
 * is never cached or indexed.
 */
const RECORD_HEADERS = {
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store',
  'Content-Security-Policy':
    "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
}

/**
 * Signed, expiring view of a stored lead (24h). Linked from the leads-inbox
 * notification so consultants can see the full ID number without it ever
 * travelling through email.
 */
export async function GET(request: Request): Promise<NextResponse> {
  const token = new URL(request.url).searchParams.get('token') ?? ''
  const leadId = verifyLeadRecordToken(token)
  if (!leadId) {
    return new NextResponse(html('Link expired or invalid', 'This lead record link has expired. Ask the system for a fresh notification.'), {
      status: 404,
      headers: RECORD_HEADERS,
    })
  }

  // Record links are only ever issued for savings-quote leads.
  const lead = await readLead(leadId)
  if (!lead || lead.kind !== 'quote') {
    return new NextResponse(html('Lead not found', 'No lead exists for this link.'), {
      status: 404,
      headers: RECORD_HEADERS,
    })
  }

  return new NextResponse(html('Lead record', leadBody(lead)), {
    headers: RECORD_HEADERS,
  })
}

function leadBody(lead: QuoteLead): string {
  const rows = lead.quote.rows
    .map(
      (row) => `<tr>
        <td>${escapeHtml(row.provider)}</td>
        <td>${escapeHtml(creditTypeLabel(row.creditType))}</td>
        <td>${escapeHtml(row.accountNumber ?? '—')}</td>
        <td class="n">${formatCents(row.balanceCents)}</td>
        <td class="n">${formatCents(row.currentMonthlyCents)}</td>
        <td class="n">${formatCents(row.newMonthlyCents)}</td>
        <td class="n">${formatCents(row.savingMonthlyCents)}</td>
      </tr>`,
    )
    .join('')

  return `
    <dl>
      <dt>Name</dt><dd>${escapeHtml(lead.firstName)} ${escapeHtml(lead.lastName)}</dd>
      <dt>ID number</dt><dd class="id">${escapeHtml(lead.idNumber)} <span class="muted">(masked: ${maskIdNumber(lead.idNumber)})</span></dd>
      <dt>Email</dt><dd>${escapeHtml(lead.email)}</dd>
      <dt>Cell</dt><dd>${escapeHtml(lead.phone)}</dd>
      <dt>Consent recorded</dt><dd>${escapeHtml(lead.consentAt)} · ${escapeHtml(lead.policyVersion)}</dd>
    </dl>
    <table>
      <thead><tr><th>Account</th><th>Type</th><th>Account no.</th><th class="n">Outstanding</th><th class="n">Current est./mo</th><th class="n">InsurIQ/mo</th><th class="n">Saving/mo</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <p class="muted">POPIA: view this record for follow-up purposes only. Do not share or export the ID number.</p>`
}

function html(title: string, body: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(title)} · InsurIQ</title>
<style>
  body { font-family: Arial, sans-serif; background: #f2f6fc; color: #1c2b4a; margin: 0; padding: 32px; }
  main { max-width: 760px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 28px; }
  h1 { font-size: 20px; color: #0B2D78; margin-top: 0; }
  dl { display: grid; grid-template-columns: 140px 1fr; gap: 6px 16px; font-size: 14px; }
  dt { color: #5a6b85; } dd { margin: 0; font-weight: bold; }
  .id { letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 20px; }
  th { background: #0B2D78; color: #fff; text-align: left; padding: 8px 10px; }
  td { padding: 7px 10px; border-bottom: 1px solid #e8edf5; }
  .n { text-align: right; }
  .muted { color: #7a8699; font-weight: normal; font-size: 12px; }
</style>
</head>
<body><main><h1>${escapeHtml(title)}</h1>${body}</main></body>
</html>`
}
