import { z } from 'zod'
import { CREDIT_TYPE_VALUES } from '@/lib/quote/savings'

/* ────────────────────────────────────────────────────────────────────────
 * Enquiry forms — contact form and CTA quick-quote banner.
 * The same schemas run client-side (UX) and server-side (authoritative).
 * ──────────────────────────────────────────────────────────────────────── */

export const LOAN_TYPE_VALUES = ['vehicle', 'home', 'personal', 'business', 'other'] as const

export type LoanType = (typeof LOAN_TYPE_VALUES)[number]

export const LOAN_TYPES: ReadonlyArray<{ value: LoanType; label: string }> = [
  { value: 'vehicle', label: 'Vehicle Finance' },
  { value: 'home', label: 'Home Loan' },
  { value: 'personal', label: 'Personal Loan' },
  { value: 'business', label: 'Business Loan' },
  { value: 'other', label: 'Other' },
]

export function loanTypeLabel(value: LoanType): string {
  return LOAN_TYPES.find((type) => type.value === value)?.label ?? 'Other'
}

const loanTypeField = z.enum(LOAN_TYPE_VALUES, { error: 'Please select a loan type' })

const saPhoneField = z
  .string()
  .trim()
  .refine((value) => normalizeSaPhone(value) !== null, 'Please enter a valid SA phone number')

const consentField = z.literal(true, { error: 'You must consent to proceed' })

export const contactFormSchema = z.object({
  firstName: z.string().trim().min(2, 'First name is required').max(50),
  lastName: z.string().trim().min(2, 'Last name is required').max(50),
  email: z.string().trim().email('Please enter a valid email address'),
  phone: saPhoneField,
  loanType: loanTypeField,
  loanAmount: z.string().min(1, 'Please enter an approximate loan amount'),
  message: z.string().max(500).optional(),
  consent: consentField,
})

export type ContactFormData = z.infer<typeof contactFormSchema>

/** CTA banner — a deliberately short form: name, phone, loan type, consent. */
export const quickQuoteSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  phone: saPhoneField,
  loanType: loanTypeField,
  consent: consentField,
})

export type QuickQuoteData = z.infer<typeof quickQuoteSchema>

/** POST /api/leads — one endpoint, discriminated by the submitting form. */
export const enquiryLeadSchema = z.discriminatedUnion('source', [
  contactFormSchema.extend({ source: z.literal('contact-form') }),
  quickQuoteSchema.extend({ source: z.literal('cta-banner') }),
])

export type EnquiryLeadData = z.infer<typeof enquiryLeadSchema>

/* ────────────────────────────────────────────────────────────────────────
 * SA ID number — 13 digits, valid YYMMDD date, Luhn check digit.
 * POPIA: validated server-side; never placed in URLs or client logs.
 * ──────────────────────────────────────────────────────────────────────── */

function luhnCheckDigit(digits12: string): number {
  let sum = 0
  for (let i = 0; i < 12; i += 1) {
    let d = Number(digits12[11 - i])
    if (i % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return (10 - (sum % 10)) % 10
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

/** Full SA ID validation: format, date of birth, and Luhn checksum. */
export function isValidSaIdNumber(value: string): boolean {
  if (!/^\d{13}$/.test(value)) return false

  const month = Number(value.slice(2, 4))
  const day = Number(value.slice(4, 6))
  const yy = Number(value.slice(0, 2))
  const dateOk =
    month >= 1 &&
    month <= 12 &&
    day >= 1 &&
    day <= 31 &&
    // The century is not encoded; accept either that makes a valid date.
    (isValidCalendarDate(1900 + yy, month, day) ||
      isValidCalendarDate(2000 + yy, month, day))
  if (!dateOk) return false

  return luhnCheckDigit(value.slice(0, 12)) === Number(value[12])
}

/** Display masking for notifications: only the last 4 digits survive. */
export function maskIdNumber(value: string): string {
  return `•••• ••• ••• ${value.slice(-4)}`
}

/** Normalise SA cell formats (082…, +2782…, spaces) to 27XXXXXXXXX. */
export function normalizeSaPhone(value: string): string | null {
  const digits = value.replace(/[\s\-()]/g, '')
  const match = /^(?:\+27|0)(\d{9})$/.exec(digits)
  if (!match) return null
  return `27${match[1]}`
}

/* ────────────────────────────────────────────────────────────────────────
 * Quote calculator schemas
 * ──────────────────────────────────────────────────────────────────────── */

export const MAX_QUOTE_ACCOUNTS = 18
export const MAX_ACCOUNT_BALANCE = 10_000_000
export const MAX_YEARS_REMAINING = 20

export const quoteAccountSchema = z.object({
  provider: z.string().min(2, 'Choose a credit provider').max(120),
  accountNumber: z.string().max(40).optional(),
  creditType: z.enum(CREDIT_TYPE_VALUES, { error: 'Choose the credit type' }),
  balance: z
    .number({ error: 'Enter the outstanding balance' })
    .int('Enter the balance in whole rands')
    .min(1, 'Balance must be at least R1')
    .max(MAX_ACCOUNT_BALANCE, `Balance cannot exceed R${MAX_ACCOUNT_BALANCE.toLocaleString('en-ZA')}`),
  /** Optional actual monthly premium (whole rands) from the client's statement. */
  currentPremium: z
    .number()
    .int('Enter the premium in whole rands')
    .min(0)
    .max(MAX_ACCOUNT_BALANCE)
    .optional(),
})

export const quoteCalculationSchema = z.object({
  accounts: z
    .array(quoteAccountSchema)
    .min(1, 'Add at least one account')
    .max(MAX_QUOTE_ACCOUNTS, `A maximum of ${MAX_QUOTE_ACCOUNTS} accounts can be quoted`),
  yearsRemaining: z
    .number()
    .int('Enter whole years')
    .min(1)
    .max(MAX_YEARS_REMAINING)
    .optional(),
})

export type QuoteAccountData = z.infer<typeof quoteAccountSchema>
export type QuoteCalculationData = z.infer<typeof quoteCalculationSchema>

export const quoteLeadSchema = z.object({
  accounts: quoteCalculationSchema.shape.accounts,
  yearsRemaining: quoteCalculationSchema.shape.yearsRemaining,
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  idNumber: z
    .string()
    .trim()
    .refine(isValidSaIdNumber, 'Please enter a valid 13-digit SA ID number'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .transform((value) => normalizeSaPhone(value) ?? value)
    .refine((value) => /^27\d{9}$/.test(value), 'Please enter a valid SA cellphone number'),
  consent: z.literal(true, {
    error: 'You must consent to proceed',
  }),
  /** Honeypot — must stay empty; hidden from real users. */
  website: z.string().max(0).optional(),
})

export type QuoteLeadData = z.infer<typeof quoteLeadSchema>
