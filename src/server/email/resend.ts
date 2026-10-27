/**
 * Resend transactional email (server-only). REST via fetch — no SDK needed.
 * Callers own the HTML and must escape every interpolated value
 * (escapeHtml in lib/utils) — user input reaches these templates.
 */
const RESEND_URL = 'https://api.resend.com/emails'

export interface EmailResult {
  sent: boolean
  reason?: string
}

export interface EmailMessage {
  to: string
  subject: string
  html: string
  attachments?: Array<{ filename: string; content: string }>
}

function fromAddress(): string {
  return process.env.RESEND_FROM ?? 'InsurIQ <quotes@insuriq.co.za>'
}

/** The InsurIQ inbox that receives every new-lead notification. */
export function leadsInbox(): string {
  return process.env.LEADS_NOTIFICATION_EMAIL ?? 'leads@insuriq.co.za'
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  if (!apiKey) return { sent: false, reason: 'RESEND_API_KEY not configured' }
  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: fromAddress(), ...message }),
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
