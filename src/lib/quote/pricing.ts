/**
 * Credit life insurance quote engine — South African market.
 *
 * Pricing in SA credit life is constrained by the National Credit Act (NCA)
 * "Credit Life Insurance Regulations" (effective 9 August 2017), which set a
 * PRESCRIBED MAXIMUM premium per R1,000 of the outstanding (deferred) balance:
 *
 *   • Mortgage / home loan agreements .......... R2.00 per R1,000
 *   • All other credit agreements .............. R4.50 per R1,000
 *     (vehicle finance, personal loans, credit facilities, retail accounts)
 *
 * Most banks and lenders charge AT or NEAR this legal maximum on a flat basis.
 * InsurIQ risk-rates each life individually and prices below the cap — that
 * difference is the saving this calculator illustrates.
 *
 * The figures below are INDICATIVE for the purpose of an on-site estimate.
 * TODO(launch): replace base rates and loadings with the underwriter's
 * confirmed rate card before go-live. The prescribed maximums are statutory
 * and must not be exceeded.
 */

export type LoanType =
  | 'mortgage'
  | 'vehicle'
  | 'personal'
  | 'credit-facility'
  | 'retail'
  | 'business'

export type EmploymentStatus =
  | 'employed'
  | 'self-employed'
  | 'commission'
  | 'pensioner'

export interface QuoteInput {
  loanType: LoanType
  /** Outstanding (deferred) balance in Rand. */
  balance: number
  /** Remaining term of the credit agreement, in months. */
  termMonths: number
  /** Age of the life insured, in years. */
  age: number
  smoker: boolean
  employment: EmploymentStatus
  /** Retrenchment / loss-of-income cover (only available to the employed). */
  retrenchmentCover: boolean
  /** Optional dread-disease (critical illness) add-on. */
  dreadDiseaseCover: boolean
  /**
   * What the customer currently pays per month for credit life, if known.
   * When supplied it is used as the comparison baseline instead of the
   * assumed bank/prescribed-maximum premium.
   */
  currentPremium?: number | null
}

export interface QuoteResult {
  /** Statutory cap for this loan type, R per R1,000. */
  prescribedMaxRate: number
  /** Assumed bank rate, R per R1,000 (banks typically charge the cap). */
  bankRate: number
  /** InsurIQ rate after risk-rating, R per R1,000 (always ≤ prescribed max). */
  insuriqRate: number
  bankMonthly: number
  insuriqMonthly: number
  /** Comparison baseline: the customer's current premium, else the bank premium. */
  baselineMonthly: number
  monthlySaving: number
  annualSaving: number
  /** Indicative saving over the remaining term (balance amortises, so ~halved). */
  termSaving: number
  savingPercent: number
  /** True when a current premium was supplied and used as the baseline. */
  comparedToCurrent: boolean
}

/** Statutory maximum credit life premium, R per R1,000 outstanding (NCA, 2017). */
export const PRESCRIBED_MAX_RATE: Record<LoanType, number> = {
  mortgage: 2.0,
  vehicle: 4.5,
  personal: 4.5,
  'credit-facility': 4.5,
  retail: 4.5,
  business: 4.5,
}

/**
 * InsurIQ base rate per R1,000 (death + permanent & temporary disability —
 * the NCA-mandatory core cover), before age / smoker / benefit loadings.
 */
const INSURIQ_BASE_RATE: Record<LoanType, number> = {
  mortgage: 1.05,
  vehicle: 2.4,
  personal: 2.55,
  'credit-facility': 2.6,
  retail: 2.7,
  business: 2.85,
}

/** Multiplicative loadings applied to the InsurIQ base rate. */
const SMOKER_LOADING = 1.25
const RETRENCHMENT_LOADING = 1.12
const DREAD_DISEASE_LOADING = 1.18

/** Age-band risk multiplier — older lives carry higher mortality/morbidity risk. */
function ageMultiplier(age: number): number {
  if (age < 30) return 0.85
  if (age < 40) return 1.0
  if (age < 50) return 1.2
  if (age < 60) return 1.55
  if (age < 66) return 2.0
  return 2.4
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max)

/**
 * Calculate an indicative credit life quote for the given inputs.
 * The returned InsurIQ rate is always held below the statutory cap.
 */
export function calculateQuote(input: QuoteInput): QuoteResult {
  const prescribedMaxRate = PRESCRIBED_MAX_RATE[input.loanType]
  const bankRate = prescribedMaxRate // banks typically charge the legal maximum

  // Retrenchment cover is only valid for the employed; ignore it otherwise.
  const retrenchment =
    input.retrenchmentCover && input.employment === 'employed'

  let insuriqRate = INSURIQ_BASE_RATE[input.loanType]
  insuriqRate *= ageMultiplier(input.age)
  if (input.smoker) insuriqRate *= SMOKER_LOADING
  if (retrenchment) insuriqRate *= RETRENCHMENT_LOADING
  if (input.dreadDiseaseCover) insuriqRate *= DREAD_DISEASE_LOADING

  // Never claim to price at the cap — hold a small margin below the statutory max.
  insuriqRate = clamp(insuriqRate, 0.4, prescribedMaxRate * 0.97)

  const per1000 = input.balance / 1000
  const bankMonthly = per1000 * bankRate
  const insuriqMonthly = per1000 * insuriqRate

  const comparedToCurrent =
    typeof input.currentPremium === 'number' && input.currentPremium > 0
  const baselineMonthly = comparedToCurrent
    ? (input.currentPremium as number)
    : bankMonthly

  const monthlySaving = Math.max(baselineMonthly - insuriqMonthly, 0)
  const annualSaving = monthlySaving * 12
  // Balance amortises toward zero over the term, so the premium (and therefore
  // the saving) declines roughly linearly — approximate lifetime saving at ~half.
  const termSaving = monthlySaving * input.termMonths * 0.5
  const savingPercent =
    baselineMonthly > 0
      ? Math.round((monthlySaving / baselineMonthly) * 100)
      : 0

  return {
    prescribedMaxRate,
    bankRate,
    insuriqRate,
    bankMonthly,
    insuriqMonthly,
    baselineMonthly,
    monthlySaving,
    annualSaving,
    termSaving,
    savingPercent,
    comparedToCurrent,
  }
}
