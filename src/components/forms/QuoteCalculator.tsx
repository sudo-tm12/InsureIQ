'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
  Home,
  Car,
  Banknote,
  CreditCard,
  ShoppingBag,
  Briefcase,
  HeartPulse,
  Accessibility,
  Umbrella,
  Stethoscope,
  Check,
  Lock,
} from 'lucide-react'
import {
  calculateQuote,
  type LoanType,
  type EmploymentStatus,
} from '@/lib/quote/pricing'
import { cn } from '@/lib/utils'

/* ────────────────────────────────────────────────────────────────────────
 * Static option metadata
 * ──────────────────────────────────────────────────────────────────────── */

interface LoanOption {
  value: LoanType
  label: string
  description: string
  icon: typeof Home
  /** Sensible default remaining term, in months, when this type is chosen. */
  defaultTermMonths: number
  /** Maximum selectable term, in months. */
  maxTermMonths: number
}

const LOAN_OPTIONS: LoanOption[] = [
  { value: 'mortgage', label: 'Home Loan', description: 'Bond or mortgage', icon: Home, defaultTermMonths: 240, maxTermMonths: 360 },
  { value: 'vehicle', label: 'Vehicle Finance', description: 'Car, bakkie or bike', icon: Car, defaultTermMonths: 60, maxTermMonths: 84 },
  { value: 'personal', label: 'Personal Loan', description: 'Unsecured credit', icon: Banknote, defaultTermMonths: 48, maxTermMonths: 84 },
  { value: 'credit-facility', label: 'Credit Card', description: 'Card or overdraft', icon: CreditCard, defaultTermMonths: 36, maxTermMonths: 60 },
  { value: 'retail', label: 'Store / Retail', description: 'Clothing or store account', icon: ShoppingBag, defaultTermMonths: 24, maxTermMonths: 48 },
  { value: 'business', label: 'Business Loan', description: 'Commercial funding', icon: Briefcase, defaultTermMonths: 60, maxTermMonths: 120 },
]

interface EmploymentOption {
  value: EmploymentStatus
  label: string
  /** Whether retrenchment cover is available to this group. */
  retrenchmentEligible: boolean
}

const EMPLOYMENT_OPTIONS: EmploymentOption[] = [
  { value: 'employed', label: 'Permanently employed', retrenchmentEligible: true },
  { value: 'commission', label: 'Commission / contract', retrenchmentEligible: false },
  { value: 'self-employed', label: 'Self-employed', retrenchmentEligible: false },
  { value: 'pensioner', label: 'Pensioner / retired', retrenchmentEligible: false },
]

const AGE_MIN = 18
const AGE_MAX = 75

/* ────────────────────────────────────────────────────────────────────────
 * Formatting helpers
 * ──────────────────────────────────────────────────────────────────────── */

function formatRand(amount: number): string {
  return `R ${Math.round(amount).toLocaleString('en-ZA')}`
}

function formatRandDecimal(amount: number): string {
  return `R ${amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/** Parse a free-typed currency string into a number (digits only). */
function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? Number(digits) : 0
}

/** Group digits with thousands separators for display in the input. */
function formatAmountInput(value: number): string {
  return value > 0 ? value.toLocaleString('en-ZA') : ''
}

function describeTerm(months: number): string {
  const years = Math.round(months / 12)
  return years <= 1 ? '1 year' : `${years} years`
}

/* ────────────────────────────────────────────────────────────────────────
 * Shared field primitives
 * ──────────────────────────────────────────────────────────────────────── */

const inputBase = cn(
  'w-full px-4 rounded-xl min-h-[52px]',
  'bg-white border-[1.5px] border-brand-border',
  'text-brand-ink text-[16px] font-body',
  'focus:outline-none focus:border-brand-cyan focus:shadow-focus-ring',
  'transition-colors duration-fast',
)

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[]
  value: T
  onChange: (value: T) => void
  ariaLabel: string
}

function Segmented<T extends string>({ options, value, onChange, ariaLabel }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex w-full bg-brand-cloud rounded-xl p-1 gap-1">
      {options.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex-1 h-11 rounded-lg text-[14px] font-body font-semibold',
              'transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
              active ? 'bg-brand-navy text-white shadow-sm' : 'text-brand-muted hover:text-brand-navy',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Wizard state
 * ──────────────────────────────────────────────────────────────────────── */

interface FormState {
  loanType: LoanType | null
  balance: number
  termMonths: number
  age: number
  smoker: boolean
  employment: EmploymentStatus
  retrenchmentCover: boolean
  dreadDiseaseCover: boolean
  currentPremium: number
}

const INITIAL_STATE: FormState = {
  loanType: null,
  balance: 0,
  termMonths: 60,
  age: 35,
  smoker: false,
  employment: 'employed',
  retrenchmentCover: true,
  dreadDiseaseCover: false,
  currentPremium: 0,
}

type Step = 1 | 2 | 3 | 4
const STEP_LABELS = ['Loan', 'About you', 'Cover', 'Estimate']

/* ────────────────────────────────────────────────────────────────────────
 * Step 1 — Loan details
 * ──────────────────────────────────────────────────────────────────────── */

interface StepProps {
  state: FormState
  update: (patch: Partial<FormState>) => void
}

function StepLoan({ state, update }: StepProps) {
  const selected = LOAN_OPTIONS.find((o) => o.value === state.loanType)
  const maxTerm = selected?.maxTermMonths ?? 84

  return (
    <div>
      <h2 className="font-display font-bold text-brand-navy text-xl mb-1">Your loan</h2>
      <p className="text-brand-muted text-sm font-body mb-6">
        Credit life premiums are charged on your outstanding balance.
      </p>

      <fieldset className="mb-6">
        <legend className="text-sm font-body font-medium text-brand-navy mb-3">
          What type of credit is it?
        </legend>
        <div className="grid grid-cols-2 gap-2.5">
          {LOAN_OPTIONS.map(({ value, label, description, icon: Icon, defaultTermMonths }) => {
            const active = state.loanType === value
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  update({ loanType: value, termMonths: defaultTermMonths })
                }
                aria-pressed={active}
                className={cn(
                  'flex flex-col gap-2 p-3.5 rounded-xl border-[1.5px] text-left',
                  'transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                  active ? 'border-brand-cyan bg-brand-cyan/5' : 'border-brand-border bg-white hover:border-brand-cyan/40',
                )}
              >
                <Icon
                  className={cn('w-5 h-5', active ? 'text-brand-cyan' : 'text-brand-muted')}
                  aria-hidden="true"
                />
                <span>
                  <span className={cn('block font-body font-semibold text-[13px] leading-tight', active ? 'text-brand-navy' : 'text-brand-body')}>
                    {label}
                  </span>
                  <span className="block text-[11px] text-brand-muted font-body mt-0.5">{description}</span>
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="mb-6">
        <label htmlFor="balance-input" className="block text-sm font-body font-medium text-brand-navy mb-2">
          Outstanding balance
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-body text-[16px] pointer-events-none">
            R
          </span>
          <input
            id="balance-input"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={formatAmountInput(state.balance)}
            onChange={(e) => update({ balance: parseAmount(e.target.value) })}
            className={cn(inputBase, 'pl-8')}
          />
        </div>
        <p className="text-[12px] text-brand-muted font-body mt-1.5">
          The amount you still owe today — an estimate is fine.
        </p>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="term-input" className="text-sm font-body font-medium text-brand-navy">
            Remaining term
          </label>
          <span className="font-display font-bold text-brand-navy text-sm">
            {describeTerm(state.termMonths)}
          </span>
        </div>
        <input
          id="term-input"
          type="range"
          min={12}
          max={maxTerm}
          step={12}
          value={state.termMonths}
          onChange={(e) => update({ termMonths: Number(e.target.value) })}
          disabled={!state.loanType}
          className="w-full accent-brand-cyan disabled:opacity-40 cursor-pointer"
          aria-valuetext={describeTerm(state.termMonths)}
        />
        <div className="flex justify-between text-[11px] text-brand-muted font-body mt-1">
          <span>1 yr</span>
          <span>{describeTerm(maxTerm)}</span>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 2 — About you
 * ──────────────────────────────────────────────────────────────────────── */

function StepAbout({ state, update }: StepProps) {
  return (
    <div>
      <h2 className="font-display font-bold text-brand-navy text-xl mb-1">About you</h2>
      <p className="text-brand-muted text-sm font-body mb-6">
        Your premium is risk-rated — this is where the saving comes from.
      </p>

      {/* Age */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <label htmlFor="age-input" className="text-sm font-body font-medium text-brand-navy">
            Your age
          </label>
          <span className="font-display font-bold text-brand-navy text-lg leading-none">{state.age}</span>
        </div>
        <input
          id="age-input"
          type="range"
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          value={state.age}
          onChange={(e) => update({ age: Number(e.target.value) })}
          className="w-full accent-brand-cyan cursor-pointer"
          aria-valuetext={`${state.age} years`}
        />
        <div className="flex justify-between text-[11px] text-brand-muted font-body mt-1">
          <span>{AGE_MIN}</span>
          <span>{AGE_MAX}+</span>
        </div>
      </div>

      {/* Smoker */}
      <div className="mb-6">
        <span className="block text-sm font-body font-medium text-brand-navy mb-2">Do you smoke?</span>
        <Segmented
          ariaLabel="Smoker status"
          value={state.smoker ? 'yes' : 'no'}
          onChange={(v) => update({ smoker: v === 'yes' })}
          options={[
            { value: 'no', label: 'Non-smoker' },
            { value: 'yes', label: 'Smoker' },
          ]}
        />
      </div>

      {/* Employment */}
      <fieldset className="mb-6">
        <legend className="text-sm font-body font-medium text-brand-navy mb-2">Employment status</legend>
        <div className="grid grid-cols-1 gap-2">
          {EMPLOYMENT_OPTIONS.map(({ value, label, retrenchmentEligible }) => {
            const active = state.employment === value
            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  update({
                    employment: value,
                    // Drop retrenchment cover automatically if it's no longer eligible.
                    retrenchmentCover: retrenchmentEligible ? state.retrenchmentCover : false,
                  })
                }
                aria-pressed={active}
                className={cn(
                  'flex items-center gap-3 p-3.5 rounded-xl border-[1.5px] text-left',
                  'transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                  active ? 'border-brand-cyan bg-brand-cyan/5' : 'border-brand-border bg-white hover:border-brand-cyan/40',
                )}
              >
                <span
                  className={cn(
                    'w-4 h-4 rounded-full border-[1.5px] flex-shrink-0 flex items-center justify-center',
                    active ? 'border-brand-cyan' : 'border-brand-border',
                  )}
                >
                  {active && <span className="w-2 h-2 rounded-full bg-brand-cyan" />}
                </span>
                <span className={cn('font-body font-semibold text-[14px]', active ? 'text-brand-navy' : 'text-brand-body')}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>

      {/* Current premium (optional) */}
      <div>
        <label htmlFor="current-premium" className="block text-sm font-body font-medium text-brand-navy mb-2">
          What do you pay now?{' '}
          <span className="text-brand-muted font-normal">(optional)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-body text-[16px] pointer-events-none">R</span>
          <input
            id="current-premium"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="Monthly credit life premium"
            value={formatAmountInput(state.currentPremium)}
            onChange={(e) => update({ currentPremium: parseAmount(e.target.value) })}
            className={cn(inputBase, 'pl-8')}
          />
        </div>
        <p className="text-[12px] text-brand-muted font-body mt-1.5">
          Check your loan statement. Leave blank and we&apos;ll compare against the legal maximum.
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 3 — Cover
 * ──────────────────────────────────────────────────────────────────────── */

interface BenefitRowProps {
  icon: typeof HeartPulse
  title: string
  description: string
  locked?: boolean
  checked: boolean
  disabled?: boolean
  onToggle?: (next: boolean) => void
}

function BenefitRow({ icon: Icon, title, description, locked, checked, disabled, onToggle }: BenefitRowProps) {
  const interactive = !locked && !disabled
  return (
    <button
      type="button"
      onClick={interactive ? () => onToggle?.(!checked) : undefined}
      aria-pressed={interactive ? checked : undefined}
      disabled={!interactive}
      className={cn(
        'w-full flex items-start gap-3 p-4 rounded-xl border-[1.5px] text-left transition-all duration-fast',
        interactive && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
        checked ? 'border-brand-cyan bg-brand-cyan/5' : 'border-brand-border bg-white',
        interactive && !checked && 'hover:border-brand-cyan/40',
        disabled && 'opacity-50',
      )}
    >
      <span
        className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0',
          checked ? 'bg-brand-cyan/15' : 'bg-brand-cloud',
        )}
      >
        <Icon className={cn('w-4 h-4', checked ? 'text-brand-cyan' : 'text-brand-muted')} aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-body font-semibold text-[14px] text-brand-navy">{title}</span>
          {locked && (
            <span className="inline-flex items-center gap-1 text-[10px] font-body font-medium text-brand-muted bg-brand-cloud rounded-full px-2 py-0.5">
              <Lock className="w-2.5 h-2.5" aria-hidden="true" /> Included
            </span>
          )}
        </span>
        <span className="block text-[12px] text-brand-muted font-body mt-0.5 leading-snug">{description}</span>
      </span>
      <span
        className={cn(
          'w-5 h-5 rounded-md border-[1.5px] flex-shrink-0 flex items-center justify-center mt-0.5',
          checked ? 'border-brand-cyan bg-brand-cyan' : 'border-brand-border bg-white',
        )}
        aria-hidden="true"
      >
        {checked && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
      </span>
    </button>
  )
}

function StepCover({ state, update }: StepProps) {
  const retrenchmentEligible =
    EMPLOYMENT_OPTIONS.find((o) => o.value === state.employment)?.retrenchmentEligible ?? false

  return (
    <div>
      <h2 className="font-display font-bold text-brand-navy text-xl mb-1">Your cover</h2>
      <p className="text-brand-muted text-sm font-body mb-6">
        Death and disability cover is required by law. Add what you need.
      </p>

      <div className="space-y-2.5">
        <BenefitRow
          icon={HeartPulse}
          title="Death cover"
          description="Settles your outstanding balance so your family never inherits the debt."
          locked
          checked
        />
        <BenefitRow
          icon={Accessibility}
          title="Disability cover"
          description="Covers your repayments if illness or injury leaves you unable to work."
          locked
          checked
        />
        <BenefitRow
          icon={Umbrella}
          title="Retrenchment cover"
          description={
            retrenchmentEligible
              ? 'Covers your repayments for a period if you lose your job.'
              : 'Only available to permanently employed applicants.'
          }
          checked={state.retrenchmentCover && retrenchmentEligible}
          disabled={!retrenchmentEligible}
          onToggle={(next) => update({ retrenchmentCover: next })}
        />
        <BenefitRow
          icon={Stethoscope}
          title="Dread disease cover"
          description="A lump-sum payout on diagnosis of a listed critical illness."
          checked={state.dreadDiseaseCover}
          onToggle={(next) => update({ dreadDiseaseCover: next })}
        />
      </div>

      <div className="flex items-start gap-2 bg-brand-cloud rounded-xl p-4 mt-6">
        <Info className="w-4 h-4 text-brand-muted flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[12px] text-brand-muted font-body leading-relaxed">
          Adding benefits increases your premium but widens your protection. We&apos;ll talk you
          through the right mix when we prepare your formal quote.
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Step 4 — Estimate
 * ──────────────────────────────────────────────────────────────────────── */

function StepEstimate({ state }: { state: FormState }) {
  const result = useMemo(
    () =>
      calculateQuote({
        loanType: state.loanType as LoanType,
        balance: state.balance,
        termMonths: state.termMonths,
        age: state.age,
        smoker: state.smoker,
        employment: state.employment,
        retrenchmentCover: state.retrenchmentCover,
        dreadDiseaseCover: state.dreadDiseaseCover,
        currentPremium: state.currentPremium || null,
      }),
    [state],
  )

  const loanLabel = LOAN_OPTIONS.find((o) => o.value === state.loanType)?.label ?? ''
  const baselineLabel = result.comparedToCurrent ? 'You pay now' : 'Bank maximum'

  return (
    <div>
      <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-2">
        YOUR ESTIMATE
      </p>
      <h2 className="font-display font-bold text-brand-navy text-xl mb-1">
        {loanLabel} · {formatRand(state.balance)}
      </h2>
      <p className="text-brand-muted text-sm font-body mb-6">
        Age {state.age} · {describeTerm(state.termMonths)} remaining
      </p>

      {/* Comparison cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-[10px] font-body font-medium uppercase tracking-wider text-red-400 mb-1">{baselineLabel}</p>
          <p className="font-display font-bold text-brand-navy text-xl leading-none">
            {formatRandDecimal(result.baselineMonthly)}
          </p>
          <p className="text-[11px] text-brand-muted font-body mt-1">per month</p>
        </div>
        <div className="bg-brand-cyan/8 border border-brand-cyan/20 rounded-xl p-4">
          <p className="text-[10px] font-body font-medium uppercase tracking-wider text-brand-cyan mb-1">InsurIQ</p>
          <p className="font-display font-bold text-brand-navy text-xl leading-none">
            {formatRandDecimal(result.insuriqMonthly)}
          </p>
          <p className="text-[11px] text-brand-muted font-body mt-1">per month</p>
        </div>
      </div>

      {/* Saving highlight */}
      <div className="bg-brand-navy rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-body uppercase tracking-wider mb-1">You could save</p>
            <p className="font-display font-bold text-white text-3xl leading-none">
              {formatRand(result.monthlySaving)}
            </p>
            <p className="text-white/60 text-sm font-body mt-1">
              per month · {formatRand(result.annualSaving)} a year
            </p>
          </div>
          {result.savingPercent > 0 && (
            <div className="text-right">
              <p className="font-display font-bold text-brand-cyan text-3xl leading-none">{result.savingPercent}%</p>
              <p className="text-white/60 text-xs font-body mt-1">cheaper</p>
            </div>
          )}
        </div>
        {result.termSaving > 0 && (
          <p className="text-white/75 text-[13px] font-body mt-4 pt-4 border-t border-white/10">
            Roughly{' '}
            <span className="font-bold text-brand-cyan">{formatRand(result.termSaving)}</span> over the
            remaining life of your loan.
          </p>
        )}
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 bg-brand-cloud rounded-xl p-4 mb-6">
        <Info className="w-4 h-4 text-brand-muted flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-[11px] text-brand-muted font-body leading-relaxed">
          This is an indicative estimate using National Credit Act prescribed maximum rates and
          InsurIQ&apos;s typical pricing — not a binding quote. Your actual premium depends on
          underwriting, your loan terms and the cover you select. InsurIQ is an Authorised
          Financial Services Provider.
        </p>
      </div>

      <Link
        href="/contact"
        className={cn(
          'w-full h-[52px] rounded-xl bg-brand-cyan text-brand-indigo font-body font-bold text-[15px]',
          'inline-flex items-center justify-center gap-2 transition-all duration-base ease-out',
          'hover:bg-brand-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
        )}
      >
        Get My Real Quote
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
      <p className="text-[11px] text-brand-muted font-body text-center mt-3">
        Free. No commitment. Response within one business day.
      </p>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────
 * Wizard shell
 * ──────────────────────────────────────────────────────────────────────── */

export function QuoteCalculator() {
  const [step, setStep] = useState<Step>(1)
  const [state, setState] = useState<FormState>(INITIAL_STATE)

  const update = (patch: Partial<FormState>) => setState((prev) => ({ ...prev, ...patch }))

  const canProceed = step === 1 ? Boolean(state.loanType) && state.balance > 0 : true

  const next = () => setStep((s) => (s < 4 ? ((s + 1) as Step) : s))
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s))

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ boxShadow: '0 4px 40px rgba(11,45,120,0.10)' }}>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center gap-1.5 mb-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className={cn('h-1 rounded-full flex-1 transition-all duration-300', step >= n ? 'bg-brand-cyan' : 'bg-brand-border')}
              aria-hidden="true"
            />
          ))}
        </div>
        <p className="text-[11px] font-body font-medium uppercase tracking-wider text-brand-muted">
          Step {step} of 4 · {STEP_LABELS[step - 1]}
        </p>
      </div>

      {/* Step body */}
      {step === 1 && <StepLoan state={state} update={update} />}
      {step === 2 && <StepAbout state={state} update={update} />}
      {step === 3 && <StepCover state={state} update={update} />}
      {step === 4 && <StepEstimate state={state} />}

      {/* Navigation (hidden on the results step — it has its own CTA) */}
      {step < 4 && (
        <div className="flex items-center gap-3 mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center justify-center gap-1.5 h-[52px] px-5 rounded-xl border-[1.5px] border-brand-border text-brand-body font-body font-semibold text-[15px] hover:border-brand-cyan/40 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={!canProceed}
            className={cn(
              'flex-1 h-[52px] rounded-xl bg-brand-navy text-white font-body font-bold text-[15px]',
              'inline-flex items-center justify-center gap-2 transition-all duration-base ease-out',
              'hover:bg-[#0d3590] hover:shadow-btn-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none',
            )}
          >
            {step === 3 ? 'Calculate My Saving' : 'Continue'}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-brand-border">
        <ShieldCheck className="w-4 h-4 text-brand-cyan" aria-hidden="true" />
        <p className="text-[11px] text-brand-muted font-body">FSCA Licensed Financial Services Provider</p>
      </div>
    </div>
  )
}
