/**
 * Credit life savings engine — pure money math, no rate data.
 *
 * Model (from CLI QUOTE CALCULATOR (MEDIATION) V4.0):
 *   premium per month = balance ÷ 1000 × rate   [rate = R per R1,000 per month]
 *   InsurIQ rate      = max(2.50, provider rate − 0.50)
 *
 * Rates are carried as integer hundredths (3.40 → 340) and money as integer
 * cents. No floats in the calculation path — every figure reconciles to the
 * consultant workbook to the cent.
 */

/** R0.50 per R1,000 reduction — confirmed business rule. */
export const RATE_REDUCTION_HUNDREDTHS = 50
/** R2.50 per R1,000 floor — "the actual rate we use starts from 2.5". */
export const NEW_RATE_FLOOR_HUNDREDTHS = 250
/**
 * NCA credit life cap on mortgage agreements: R2.00 per R1,000 per month.
 * The R2.50 floor must never apply to home loans — it would breach the cap,
 * and no lender may charge above it, so it also bounds our estimate of what
 * the client pays now.
 */
export const NCA_MORTGAGE_CAP_HUNDREDTHS = 200

/** Credit agreement types the visitor picks per account row. */
export const CREDIT_TYPE_VALUES = [
  'home-loan',
  'vehicle-finance',
  'personal-loan',
  'credit-card',
  'overdraft',
  'revolving-credit',
  'retail-account',
  'student-loan',
  'other',
] as const

export type CreditType = (typeof CREDIT_TYPE_VALUES)[number]

export const CREDIT_TYPES: ReadonlyArray<{ value: CreditType; label: string }> = [
  { value: 'home-loan', label: 'Home Loan' },
  { value: 'vehicle-finance', label: 'Vehicle Finance' },
  { value: 'personal-loan', label: 'Personal Loan' },
  { value: 'credit-card', label: 'Credit Card' },
  { value: 'overdraft', label: 'Overdraft / Cheque' },
  { value: 'revolving-credit', label: 'Revolving Credit' },
  { value: 'retail-account', label: 'Retail / Store Account' },
  { value: 'student-loan', label: 'Student Loan' },
  { value: 'other', label: 'Other' },
]

export function creditTypeLabel(value: CreditType): string {
  return CREDIT_TYPES.find((type) => type.value === value)?.label ?? 'Other'
}

export interface QuoteAccountInput {
  /** Exact provider name from the rate book (combobox selection). */
  provider: string
  accountNumber?: string
  /** Outstanding balance in whole rands. */
  balance: number
  /** The credit agreement type — picked by the visitor. */
  creditType: CreditType
  /**
   * Optional: the client's actual monthly premium in cents, taken from their
   * statement. When given it replaces our estimate ("what do you pay now?").
   */
  currentPremiumCents?: number
}

export interface ResolvedRate {
  provider: string
  /** Estimated current CLI rate, hundredths (e.g. 340 = R3.40). */
  rateHundredths: number
}

export interface QuoteRowResult {
  provider: string
  accountNumber: string | null
  creditType: CreditType
  balanceCents: number
  currentMonthlyCents: number
  /** True when currentMonthlyCents is the client's own figure, not our estimate. */
  isOwnFigure: boolean
  newMonthlyCents: number
  savingMonthlyCents: number
  /** True when the provider is already at/below our rate — never quoted worse off. */
  alreadyBestRate: boolean
}

export interface QuoteSummary {
  totalBalanceCents: number
  currentMonthlyCents: number
  newMonthlyCents: number
  savingMonthlyCents: number
  savingAnnualCents: number
  /** Planning horizon for the term saving. */
  yearsRemaining: number
  /** Rough total saving over the horizon: annual × years (balances decline over time). */
  termSavingCents: number
}

export interface QuoteResult {
  rows: QuoteRowResult[]
  summary: QuoteSummary
}

/** The InsurIQ rate for a provider, in hundredths: max(2.50, rate − 0.50). */
export function insurIqRateHundredths(currentRateHundredths: number): number {
  return Math.max(
    NEW_RATE_FLOOR_HUNDREDTHS,
    currentRateHundredths - RATE_REDUCTION_HUNDREDTHS,
  )
}

/**
 * The InsurIQ rate by credit type.
 * - Home loans: the NCA mortgage cap of R2.00 per R1,000 — the R2.50 floor
 *   must never apply (it would breach the cap).
 * - Everything else: R0.50 less than the provider rate, floored at R2.50.
 */
export function insurIqRateForType(
  currentRateHundredths: number,
  creditType: CreditType,
): number {
  return creditType === 'home-loan'
    ? NCA_MORTGAGE_CAP_HUNDREDTHS
    : insurIqRateHundredths(currentRateHundredths)
}

/**
 * The rate we assume the client pays now, by credit type. A provider's book
 * rate is for its unsecured lending; on a home loan the NCA cap is the legal
 * maximum, so estimating above it would overstate the saving. A client who
 * really pays more (e.g. cover priced on the original bond) can enter their
 * own premium, which replaces this estimate.
 */
export function currentRateForType(
  providerRateHundredths: number,
  creditType: CreditType,
): number {
  return creditType === 'home-loan'
    ? Math.min(providerRateHundredths, NCA_MORTGAGE_CAP_HUNDREDTHS)
    : providerRateHundredths
}

/** Monthly premium in cents for a balance in rands at a rate in hundredths. */
export function monthlyPremiumCents(balanceRand: number, rateHundredths: number): number {
  return Math.round((balanceRand * rateHundredths) / 1000)
}

export interface CalculateOptions {
  /** Planning horizon in years for the term saving (default 5). */
  yearsRemaining?: number
}

/**
 * Compute the full quote. `rates` must cover every account provider
 * (the server resolves names against the rate book before calling).
 */
export function calculateSavings(
  accounts: QuoteAccountInput[],
  rates: ResolvedRate[],
  options: CalculateOptions = {},
): QuoteResult {
  const rateByProvider = new Map(rates.map((r) => [r.provider, r.rateHundredths]))

  const rows: QuoteRowResult[] = accounts.map((account) => {
    const currentRateHundredths = rateByProvider.get(account.provider)
    if (currentRateHundredths === undefined) {
      throw new Error(`No rate resolved for provider: ${account.provider}`)
    }
    const newRateHundredths = insurIqRateForType(currentRateHundredths, account.creditType)
    const estimatedCents = monthlyPremiumCents(
      account.balance,
      currentRateForType(currentRateHundredths, account.creditType),
    )
    const rawNewMonthlyCents = monthlyPremiumCents(account.balance, newRateHundredths)

    // "What do you pay now?" — the client's own figure beats our estimate.
    const isOwnFigure = typeof account.currentPremiumCents === 'number' && account.currentPremiumCents > 0
    const currentMonthlyCents = isOwnFigure ? (account.currentPremiumCents as number) : estimatedCents

    // No-savings rule: never quote someone worse off than they already are.
    const alreadyBestRate = rawNewMonthlyCents >= currentMonthlyCents
    const newMonthlyCents = alreadyBestRate ? currentMonthlyCents : rawNewMonthlyCents

    return {
      provider: account.provider,
      accountNumber: account.accountNumber?.trim() || null,
      creditType: account.creditType,
      balanceCents: account.balance * 100,
      currentMonthlyCents,
      isOwnFigure,
      newMonthlyCents,
      savingMonthlyCents: currentMonthlyCents - newMonthlyCents,
      alreadyBestRate,
    }
  })

  const sum = (pick: (row: QuoteRowResult) => number) =>
    rows.reduce((total, row) => total + pick(row), 0)

  const savingMonthlyCents = sum((row) => row.savingMonthlyCents)
  const yearsRemaining = Math.min(Math.max(options.yearsRemaining ?? 5, 1), 20)
  const summary: QuoteSummary = {
    totalBalanceCents: sum((row) => row.balanceCents),
    currentMonthlyCents: sum((row) => row.currentMonthlyCents),
    newMonthlyCents: sum((row) => row.newMonthlyCents),
    savingMonthlyCents,
    savingAnnualCents: savingMonthlyCents * 12,
    yearsRemaining,
    termSavingCents: savingMonthlyCents * 12 * yearsRemaining,
  }

  return { rows, summary }
}
