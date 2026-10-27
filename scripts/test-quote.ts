/**
 * Quote engine and lead capture tests — run with: npm run test:quote
 *
 * Includes the acceptance test from QUOTE-CALCULATOR-SPEC.md §3.1: the
 * worked example must reconcile to the cent, and the real encrypted rate book
 * must decrypt end-to-end (key → decrypt → lookup → maths). No real
 * provider rate appears in this public repo — example rates are illustrative.
 * Email tests stub fetch — nothing is ever sent to Resend.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import {
  calculateSavings,
  insurIqRateHundredths,
  insurIqRateForType,
  monthlyPremiumCents,
} from '../src/lib/quote/savings'
import {
  isValidSaIdNumber,
  maskIdNumber,
  normalizeSaPhone,
} from '../src/lib/validations'
import { findRateHundredths, searchProviders } from '../src/server/ratebook'
import { sendLeadNotificationEmail } from '../src/server/quote/email'
import { sendEnquiryNotificationEmail } from '../src/server/leads/notifications'
import { seal, unseal, type LeadPayload } from '../src/server/leads/store'

// Load .env.local so the rate-book key is available (dev convenience only).
try {
  const envFile = readFileSync(path.join(process.cwd(), '.env.local'), 'utf-8')
  for (const line of envFile.split('\n')) {
    const match = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2]
  }
} catch {
  // Env may already be exported — fine.
}

test('rate rule: R0.50 less per R1,000, floored at R2.50', () => {
  assert.equal(insurIqRateHundredths(340), 290) // 3.40 → 2.90
  assert.equal(insurIqRateHundredths(450), 400) // 4.50 → 4.00 (NCA cap case)
  assert.equal(insurIqRateHundredths(280), 250) // 2.80 → floor 2.50
  assert.equal(insurIqRateHundredths(250), 250) // 2.50 → floor, unchanged
  assert.equal(insurIqRateHundredths(180), 250) // 1.80 → floor 2.50
})

test('home loans: NCA mortgage cap R2.00 — the R2.50 floor never applies', () => {
  assert.equal(insurIqRateForType(340, 'home-loan'), 200) // capped at R2.00
  assert.equal(insurIqRateForType(220, 'home-loan'), 200) // capped at R2.00
  assert.equal(insurIqRateForType(340, 'personal-loan'), 290) // standard rule
  assert.equal(insurIqRateForType(180, 'home-loan'), 200) // 2.00 > 1.80 → no-savings guard applies
})

test('premium maths in cents: balance ÷ 1000 × rate', () => {
  assert.equal(monthlyPremiumCents(100_000, 340), 34_000) // R340.00
  assert.equal(monthlyPremiumCents(100_000, 290), 29_000) // R290.00
  assert.equal(monthlyPremiumCents(33_333, 265), 8_833) // rounded to the cent
})

test('ACCEPTANCE — spec §3.1 worked example (illustrative rate), R100,000', () => {
  const quote = calculateSavings(
    [{ provider: 'Example Credit Card', balance: 100_000, creditType: 'credit-card' }],
    [{ provider: 'Example Credit Card', rateHundredths: 340 }],
  )
  const [row] = quote.rows
  assert.equal(row.creditType, 'credit-card')
  assert.equal(row.currentMonthlyCents, 34_000) // R 340.00
  assert.equal(row.newMonthlyCents, 29_000) // R 290.00
  assert.equal(row.savingMonthlyCents, 5_000) // R 50.00
  assert.equal(row.alreadyBestRate, false)
  assert.equal(quote.summary.savingMonthlyCents, 5_000)
  assert.equal(quote.summary.savingAnnualCents, 60_000) // R 600.00
  assert.equal(quote.summary.totalBalanceCents, 10_000_000)
})

test('home-loan row uses the mortgage cap and never quotes worse off', () => {
  const quote = calculateSavings(
    [
      { provider: 'Bond Provider', balance: 500_000, creditType: 'home-loan' },
      { provider: 'Cheap Provider', balance: 50_000, creditType: 'personal-loan' },
    ],
    [
      { provider: 'Bond Provider', rateHundredths: 340 }, // overcharging above the cap
      { provider: 'Cheap Provider', rateHundredths: 230 }, // R2.30 — at/below our floor
    ],
  )
  const [bond, cheap] = quote.rows
  // Bond: 500 000 ÷ 1000 × 2.00 = R1 000 vs 3.40 = R1 700 → saves R700/mo
  assert.equal(bond.currentMonthlyCents, 170_000)
  assert.equal(bond.newMonthlyCents, 100_000)
  assert.equal(bond.savingMonthlyCents, 70_000)
  // Cheap: no-savings guard — identical premiums
  assert.equal(cheap.alreadyBestRate, true)
  assert.equal(cheap.newMonthlyCents, cheap.currentMonthlyCents)
  assert.equal(cheap.savingMonthlyCents, 0)
})

test('multi-account totals and annual saving × 12', () => {
  const quote = calculateSavings(
    [
      { provider: 'A', balance: 100_000, creditType: 'credit-card' },
      { provider: 'B', balance: 20_000, accountNumber: ' 123 ', creditType: 'vehicle-finance' },
    ],
    [
      { provider: 'A', rateHundredths: 340 },
      { provider: 'B', rateHundredths: 310 },
    ],
    { yearsRemaining: 10 },
  )
  assert.equal(quote.rows[1].accountNumber, '123')
  assert.equal(quote.summary.currentMonthlyCents, 34_000 + 6_200)
  assert.equal(quote.summary.newMonthlyCents, 29_000 + 5_200)
  assert.equal(quote.summary.savingMonthlyCents, 5_000 + 1_000)
  assert.equal(quote.summary.savingAnnualCents, 12 * (5_000 + 1_000))
  // Term saving: annual × years
  assert.equal(quote.summary.yearsRemaining, 10)
  assert.equal(quote.summary.termSavingCents, 12 * 6_000 * 10)
})

test('"what do you pay now?" — client figure beats our estimate', () => {
  const quote = calculateSavings(
    [
      // Estimate would be R340/mo, but they actually pay R300/mo.
      { provider: 'A', balance: 100_000, creditType: 'credit-card', currentPremiumCents: 30_000 },
    ],
    [{ provider: 'A', rateHundredths: 340 }],
    { yearsRemaining: 5 },
  )
  const [row] = quote.rows
  assert.equal(row.isOwnFigure, true)
  assert.equal(row.currentMonthlyCents, 30_000) // their figure, not the R340 estimate
  assert.equal(row.newMonthlyCents, 29_000) // InsurIQ rate still from the book rule
  assert.equal(row.savingMonthlyCents, 1_000) // R10/mo — conservative and honest
  assert.equal(quote.summary.termSavingCents, 1_000 * 12 * 5)
})

test('"what do you pay now?" — never quoted worse off against their real premium', () => {
  const quote = calculateSavings(
    [
      // They pay R250/mo — below our R290. We must not claim they'd save.
      { provider: 'A', balance: 100_000, creditType: 'credit-card', currentPremiumCents: 25_000 },
    ],
    [{ provider: 'A', rateHundredths: 340 }],
  )
  const [row] = quote.rows
  assert.equal(row.alreadyBestRate, true)
  assert.equal(row.newMonthlyCents, row.currentMonthlyCents)
  assert.equal(row.savingMonthlyCents, 0)
})

test('rate book decrypts and resolves a real provider to an in-range rate', () => {
  // Real rates are confidential: assert the workbook range, never the value.
  const rate = findRateHundredths('Absa Credit Card')
  assert.ok(rate !== null && rate >= 180 && rate <= 450, 'rate outside the workbook range')
  assert.equal(insurIqRateHundredths(rate), Math.max(250, rate - 50))

  const names = searchProviders('absa', 8)
  assert.ok(names.length > 0, 'search should find Absa entries')
  assert.ok(names.every((name) => name.toLowerCase().includes('absa')))
  // Search must never leak rates
  assert.ok(names.every((name) => /^[\w\s&/()'.,—–-]+$/.test(name)))
})

test('SA ID number validation (Luhn + real date)', () => {
  // Build a guaranteed-valid ID: 800101 + gender/citizenship + Luhn digit.
  const base12 = '800101500908'
  let sum = 0
  for (let i = 0; i < 12; i += 1) {
    let d = Number(base12[11 - i])
    if (i % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  const validId = base12 + String((10 - (sum % 10)) % 10)

  assert.ok(isValidSaIdNumber(validId))
  assert.ok(!isValidSaIdNumber(`${validId.slice(0, 12)}${(Number(validId[12]) + 1) % 10}`), 'bad check digit')
  assert.ok(!isValidSaIdNumber('800101500908'), 'too short')
  assert.ok(!isValidSaIdNumber('8013015009087'), 'invalid month')
  assert.ok(!isValidSaIdNumber('8002315009087'), 'invalid day')
  assert.ok(!isValidSaIdNumber('abcdefghijklo'), 'non-numeric')

  assert.equal(maskIdNumber(validId), `•••• ••• ••• ${validId.slice(-4)}`)
})

test('SA phone normalisation', () => {
  assert.equal(normalizeSaPhone('082 123 4567'), '27821234567')
  assert.equal(normalizeSaPhone('+27821234567'), '27821234567')
  assert.equal(normalizeSaPhone('0821234567'), '27821234567')
  assert.equal(normalizeSaPhone('12345'), null)
})

/* ── Lead capture ──────────────────────────────────────────────────────── */

const INJECTION = '<img src=x onerror=alert(1)><script>alert(1)</script>'

const sampleQuote = calculateSavings(
  [{ provider: 'Example Credit Card', accountNumber: INJECTION, balance: 100_000, creditType: 'credit-card' }],
  [{ provider: 'Example Credit Card', rateHundredths: 340 }],
)

test('lead emails HTML-escape visitor input', async () => {
  const realFetch = globalThis.fetch
  const realKey = process.env.RESEND_API_KEY
  const bodies: Array<{ html: string }> = []
  process.env.RESEND_API_KEY = 'test-key'
  globalThis.fetch = (async (_input: string | URL | Request, init?: RequestInit) => {
    bodies.push(JSON.parse(String(init?.body)) as { html: string })
    return new Response('{}', { status: 200 })
  }) as typeof fetch

  try {
    await sendLeadNotificationEmail({
      firstName: INJECTION,
      lastName: 'Smith',
      idNumber: '8001015009087',
      email: 'jane@example.com',
      phone: '27720000000',
      consentAt: '2026-10-27T00:00:00.000Z',
      quote: sampleQuote,
      recordUrl: 'https://example.com/api/quote/lead-record?token=a.b.c',
    })
    await sendEnquiryNotificationEmail({
      kind: 'enquiry',
      source: 'contact-form',
      name: INJECTION,
      email: 'jane@example.com',
      phone: '27720000000',
      loanType: 'vehicle',
      loanAmount: 'under-50k',
      message: INJECTION,
      consentAt: '2026-10-27T00:00:00.000Z',
      policyVersion: 'privacy-policy-2026-01',
    })
  } finally {
    globalThis.fetch = realFetch
    if (realKey === undefined) delete process.env.RESEND_API_KEY
    else process.env.RESEND_API_KEY = realKey
  }

  assert.equal(bodies.length, 2)
  for (const { html } of bodies) {
    assert.ok(!html.includes('<script>'), 'raw <script> reached the email')
    assert.ok(!html.includes('<img'), 'raw <img> reached the email')
    assert.ok(html.includes('&lt;script&gt;'), 'input should appear escaped')
  }
})

test('lead store: records sealed before `kind` existed read back as quote leads', () => {
  const legacy = {
    firstName: 'Jane',
    lastName: 'Smith',
    idNumber: '8001015009087',
    email: 'jane@example.com',
    phone: '27720000000',
    consentAt: '2026-10-19T00:00:00.000Z',
    policyVersion: 'privacy-policy-2026-01',
    quote: sampleQuote,
  }
  const restored = unseal(seal(legacy as unknown as LeadPayload))
  assert.equal(restored.kind, 'quote')
})
