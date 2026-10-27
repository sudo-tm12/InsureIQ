'use client'

/* ────────────────────────────────────────────────────────────────────────
 * Multi-account credit life savings calculator.
 *
 * Public flow: add accounts → server-side quote (Rand amounts only) →
 * lead capture (POPIA consent + SA ID) → PDF quote emailed and shown on screen.
 * Rate values are never sent to the browser.
 * ──────────────────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Info,
  Loader2,
  Plus,
  ShieldCheck,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import type { CreditType, QuoteResult } from '@/lib/quote/savings'
import { CREDIT_TYPES, creditTypeLabel } from '@/lib/quote/savings'
import { MAX_QUOTE_ACCOUNTS, MAX_ACCOUNT_BALANCE, isValidSaIdNumber, normalizeSaPhone } from '@/lib/validations'
import { cn, formatCents } from '@/lib/utils'

/* ── Small helpers ─────────────────────────────────────────────────────── */

function parseAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, '')
  return digits ? Math.min(Number(digits), MAX_ACCOUNT_BALANCE) : 0
}

function formatAmountInput(value: number): string {
  return value > 0 ? value.toLocaleString('en-ZA') : ''
}

const inputBase = cn(
  'w-full px-4 rounded-xl min-h-[52px]',
  'bg-white border-[1.5px] border-brand-border',
  'text-brand-ink text-[16px] font-body',
  'focus:outline-none focus:border-brand-cyan focus:shadow-focus-ring',
  'transition-colors duration-fast',
)

const labelBase = 'block text-sm font-body font-medium text-brand-navy mb-2'

/* ── Provider combobox (server-backed, names only) ─────────────────────── */

interface ProviderComboboxProps {
  inputId: string
  value: string
  selected: boolean
  onSelect: (provider: string) => void
  onClearSelection: () => void
}

function ProviderCombobox({ inputId, value, selected, onSelect, onClearSelection }: ProviderComboboxProps) {
  const listId = useId()
  const [query, setQuery] = useState(value)
  const [lookup, setLookup] = useState<{ q: string; items: string[] } | null>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Derived from the keyed fetch result — no sync setState in effects
  const trimmedQuery = query.trim()
  const suggestions = lookup !== null && lookup.q === trimmedQuery ? lookup.items : []
  const loading =
    !selected && trimmedQuery.length >= 2 && (lookup === null || lookup.q !== trimmedQuery)

  useEffect(() => {
    if (selected) return
    const trimmed = query.trim()
    if (trimmed.length < 2) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/quote/providers?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('lookup failed')
        const data = (await res.json()) as { providers: string[] }
        setLookup({ q: trimmed, items: data.providers })
        setActiveIndex(-1)
      } catch {
        if (!controller.signal.aborted) setLookup({ q: trimmed, items: [] })
      }
    }, 250)
    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [query, selected])

  const choose = (provider: string) => {
    onSelect(provider)
    setQuery(provider)
    setOpen(false)
    setLookup(null)
  }

  return (
    <div className="relative">
      <input
        id={inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open && suggestions.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        placeholder="Start typing… e.g. Absa"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          if (selected) onClearSelection()
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 150)
        }}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
            setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === 'Enter' && open && activeIndex >= 0) {
            e.preventDefault()
            choose(suggestions[activeIndex])
          } else if (e.key === 'Escape') {
            setOpen(false)
          }
        }}
        className={cn(inputBase, selected && 'border-brand-cyan/60')}
      />
      {loading && (
        <Loader2
          className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-muted animate-spin"
          aria-hidden="true"
        />
      )}
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1.5 w-full max-h-56 overflow-auto rounded-xl border-[1.5px] border-brand-border bg-white py-1 shadow-lg"
        >
          {suggestions.map((provider, index) => (
            <li
              key={provider}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseDown={(e) => {
                e.preventDefault()
                if (blurTimer.current) clearTimeout(blurTimer.current)
                choose(provider)
              }}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                'px-4 py-2.5 text-[14px] font-body cursor-pointer',
                index === activeIndex ? 'bg-brand-cyan/10 text-brand-navy' : 'text-brand-body',
              )}
            >
              {provider}
            </li>
          ))}
        </ul>
      )}
      {open && query.trim().length >= 2 && suggestions.length === 0 && !loading && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl border-[1.5px] border-brand-border bg-white px-4 py-2.5 text-[13px] text-brand-muted font-body shadow-lg">
          No provider found — check the spelling and try again.
        </div>
      )}
    </div>
  )
}

/* ── Account row model ─────────────────────────────────────────────────── */

interface AccountRow {
  id: string
  provider: string
  providerSelected: boolean
  accountNumber: string
  balance: number
  creditType: CreditType | null
  /** Optional actual monthly premium from their statement ("what do you pay now?"). */
  currentPremium: number
}

let rowCounter = 0
function emptyRow(): AccountRow {
  rowCounter += 1
  return {
    id: `row-${rowCounter}`,
    provider: '',
    providerSelected: false,
    accountNumber: '',
    balance: 0,
    creditType: null,
    currentPremium: 0,
  }
}

/* ── Lead form state ───────────────────────────────────────────────────── */

interface LeadFormState {
  firstName: string
  lastName: string
  idNumber: string
  email: string
  phone: string
  consent: boolean
  website: string
}

const EMPTY_LEAD: LeadFormState = {
  firstName: '',
  lastName: '',
  idNumber: '',
  email: '',
  phone: '',
  consent: false,
  website: '',
}

type Phase = 'input' | 'results' | 'sending' | 'sent'

const STEP_LABELS = ['Your accounts', 'Your estimate', 'Your quote'] as const

function stepForPhase(phase: Phase): number {
  if (phase === 'input') return 1
  if (phase === 'sent') return 3
  return 2
}

/* ── Step progress (borrowed from the old wizard's best feature) ───────── */

interface StepProgressProps {
  step: number
}

function StepProgress({ step }: StepProgressProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1.5 mb-2" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={cn(
              'h-1 rounded-full flex-1 transition-all duration-300',
              step >= n ? 'bg-brand-cyan' : 'bg-brand-border',
            )}
          />
        ))}
      </div>
      <p className="text-[11px] font-body font-medium uppercase tracking-wider text-brand-muted">
        Step {step} of 3 · {STEP_LABELS[step - 1]}
      </p>
    </div>
  )
}

/* ── Main calculator ───────────────────────────────────────────────────── */

export function SavingsCalculator() {
  const [phase, setPhase] = useState<Phase>('input')
  const [rows, setRows] = useState<AccountRow[]>([emptyRow()])
  const [quote, setQuote] = useState<QuoteResult | null>(null)
  const [calculating, setCalculating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lead, setLead] = useState<LeadFormState>(EMPTY_LEAD)
  const [leadErrors, setLeadErrors] = useState<Record<string, string>>({})
  const [emailSent, setEmailSent] = useState(false)
  const [yearsRemaining, setYearsRemaining] = useState(5)

  const updateRow = (id: string, patch: Partial<AccountRow>) =>
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)))

  const addRow = () =>
    setRows((prev) => (prev.length >= MAX_QUOTE_ACCOUNTS ? prev : [...prev, emptyRow()]))

  const removeRow = (id: string) =>
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((row) => row.id !== id)))

  const validAccounts = rows.filter(
    (row) => row.providerSelected && row.balance > 0 && row.creditType !== null,
  )
  const totalBalance = rows.reduce((sum, row) => sum + row.balance, 0)
  const savingPercent =
    quote && quote.summary.currentMonthlyCents > 0
      ? Math.round((quote.summary.savingMonthlyCents / quote.summary.currentMonthlyCents) * 100)
      : 0

  const calculate = useCallback(async () => {
    setError(null)
    setCalculating(true)
    try {
      const res = await fetch('/api/quote/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accounts: validAccounts.map((row) => ({
            provider: row.provider,
            accountNumber: row.accountNumber || undefined,
            balance: row.balance,
            creditType: row.creditType,
            currentPremium: row.currentPremium > 0 ? row.currentPremium : undefined,
          })),
          yearsRemaining,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setQuote(data as QuoteResult)
      setPhase('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setCalculating(false)
    }
  }, [validAccounts, yearsRemaining])

  const submitLead = async (event: React.FormEvent) => {
    event.preventDefault()
    setLeadErrors({})

    // Client-side pre-checks (the server re-validates everything).
    const errors: Record<string, string> = {}
    if (lead.firstName.trim().length < 2) errors.firstName = 'First name is required'
    if (lead.lastName.trim().length < 2) errors.lastName = 'Last name is required'
    if (!isValidSaIdNumber(lead.idNumber.replace(/\s/g, ''))) errors.idNumber = 'Enter a valid 13-digit SA ID number'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) errors.email = 'Enter a valid email address'
    if (!normalizeSaPhone(lead.phone)) errors.phone = 'Enter a valid SA cellphone number'
    if (!lead.consent) errors.consent = 'You must consent to proceed'
    if (Object.keys(errors).length > 0) {
      setLeadErrors(errors)
      return
    }

    setPhase('sending')
    setError(null)
    try {
      const res = await fetch('/api/quote/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accounts: validAccounts.map((row) => ({
            provider: row.provider,
            accountNumber: row.accountNumber || undefined,
            balance: row.balance,
            creditType: row.creditType,
            currentPremium: row.currentPremium > 0 ? row.currentPremium : undefined,
          })),
          yearsRemaining,
          firstName: lead.firstName.trim(),
          lastName: lead.lastName.trim(),
          idNumber: lead.idNumber.replace(/\s/g, ''),
          email: lead.email.trim(),
          phone: lead.phone,
          consent: lead.consent,
          website: lead.website,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')
      setEmailSent(Boolean(data.emailSent))
      setPhase('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setPhase('results')
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 lg:p-8" style={{ boxShadow: '0 4px 40px rgba(11,45,120,0.10)' }}>
      <StepProgress step={stepForPhase(phase)} />

      {phase === 'input' && (
        <div>
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-2">
            Your accounts
          </p>
          <h2 className="font-display font-bold text-brand-navy text-xl mb-1">
            Add your credit accounts
          </h2>
          <p className="text-brand-muted text-sm font-body mb-6">
            Every account with credit life cover — we&apos;ll estimate what you pay and what you
            could save.
          </p>

          <div className="space-y-4">
            {rows.map((row, index) => (
              <div key={row.id} className="rounded-xl border-[1.5px] border-brand-border p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-body font-semibold uppercase tracking-wider text-brand-muted">
                    Account {index + 1}
                  </span>
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      aria-label={`Remove account ${index + 1}`}
                      className="inline-flex items-center gap-1 text-[12px] font-body text-brand-muted hover:text-red-500 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Remove
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label htmlFor={`${row.id}-provider`} className={labelBase}>
                      Credit provider
                    </label>
                    <ProviderCombobox
                      inputId={`${row.id}-provider`}
                      value={row.provider}
                      selected={row.providerSelected}
                      onSelect={(provider) => updateRow(row.id, { provider, providerSelected: true })}
                      onClearSelection={() => updateRow(row.id, { providerSelected: false })}
                    />
                  </div>

                  <div>
                    <label htmlFor={`${row.id}-type`} className={labelBase}>
                      Credit type
                    </label>
                    <select
                      id={`${row.id}-type`}
                      value={row.creditType ?? ''}
                      onChange={(e) =>
                        updateRow(row.id, {
                          creditType: e.target.value ? (e.target.value as CreditType) : null,
                        })
                      }
                      className={cn(inputBase, 'appearance-none cursor-pointer')}
                      aria-required="true"
                    >
                      <option value="">Choose the credit type…</option>
                      {CREDIT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`${row.id}-account`} className={labelBase}>
                        Account number <span className="text-brand-muted font-normal">(optional)</span>
                      </label>
                      <input
                        id={`${row.id}-account`}
                        type="text"
                        autoComplete="off"
                        placeholder="e.g. 4356..."
                        value={row.accountNumber}
                        onChange={(e) => updateRow(row.id, { accountNumber: e.target.value })}
                        className={inputBase}
                      />
                    </div>
                    <div>
                      <label htmlFor={`${row.id}-balance`} className={labelBase}>
                        Outstanding balance
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-body text-[16px] pointer-events-none">
                          R
                        </span>
                        <input
                          id={`${row.id}-balance`}
                          type="text"
                          inputMode="numeric"
                          autoComplete="off"
                          placeholder="0"
                          value={formatAmountInput(row.balance)}
                          onChange={(e) => updateRow(row.id, { balance: parseAmount(e.target.value) })}
                          className={cn(inputBase, 'pl-8')}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor={`${row.id}-premium`} className={labelBase}>
                      What do you pay now?{' '}
                      <span className="text-brand-muted font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted font-body text-[16px] pointer-events-none">
                        R
                      </span>
                      <input
                        id={`${row.id}-premium`}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Monthly credit life premium"
                        value={formatAmountInput(row.currentPremium)}
                        onChange={(e) => updateRow(row.id, { currentPremium: parseAmount(e.target.value) })}
                        className={cn(inputBase, 'pl-8')}
                      />
                    </div>
                    <p className="text-[11px] text-brand-muted font-body mt-1.5">
                      From your statement. Leave blank and we&apos;ll estimate it for you.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={addRow}
              disabled={rows.length >= MAX_QUOTE_ACCOUNTS}
              className="inline-flex items-center gap-1.5 text-[13px] font-body font-semibold text-brand-navy hover:text-brand-cyan transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded disabled:opacity-40"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add another account
            </button>
            <p className="text-[12px] text-brand-muted font-body">
              Total outstanding:{' '}
              <span className="font-semibold text-brand-navy">{formatCents(totalBalance * 100)}</span>
            </p>
          </div>

          <div className="mt-5">
            <div className="flex items-baseline justify-between mb-2">
              <label htmlFor="years-remaining" className="text-sm font-body font-medium text-brand-navy">
                Over how many years?
              </label>
              <span className="font-display font-bold text-brand-navy text-sm">
                {yearsRemaining === 1 ? '1 year' : `${yearsRemaining} years`}
              </span>
            </div>
            <input
              id="years-remaining"
              type="range"
              min={1}
              max={20}
              step={1}
              value={yearsRemaining}
              onChange={(e) => setYearsRemaining(Number(e.target.value))}
              className="w-full accent-brand-cyan cursor-pointer"
              aria-valuetext={`${yearsRemaining} years`}
            />
            <div className="flex justify-between text-[11px] text-brand-muted font-body mt-1">
              <span>1 yr</span>
              <span>20 yrs</span>
            </div>
            <p className="text-[11px] text-brand-muted font-body mt-1.5">
              Used for your estimated total saving over the life of your accounts.
            </p>
          </div>

          {error && (
            <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[13px] text-red-600 font-body">{error}</p>
            </div>
          )}

          <button
            type="button"
            onClick={calculate}
            disabled={validAccounts.length === 0 || calculating}
            className={cn(
              'w-full h-[52px] mt-5 rounded-xl bg-brand-navy text-white font-body font-bold text-[15px]',
              'inline-flex items-center justify-center gap-2 transition-all duration-base ease-out',
              'hover:bg-[#0d3590] hover:shadow-btn-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
              'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none',
            )}
          >
            {calculating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Calculating…
              </>
            ) : (
              <>
                See my savings <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </>
            )}
          </button>
          <p className="text-[12px] text-brand-muted font-body text-center mt-2">
            {validAccounts.length === 0
              ? 'Each account needs a provider, credit type and balance to continue.'
              : `${validAccounts.length} account${validAccounts.length === 1 ? '' : 's'} ready to quote.`}
          </p>
        </div>
      )}

      {(phase === 'results' || phase === 'sending') && quote && (
        <div>
          <button
            type="button"
            onClick={() => setPhase('input')}
            className="inline-flex items-center gap-1.5 text-[13px] font-body font-semibold text-brand-muted hover:text-brand-navy transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded mb-4"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Edit accounts
          </button>

          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-2">
            Your estimate
          </p>
          <h2 className="font-display font-bold text-brand-navy text-xl mb-4">
            Here&apos;s what you could save
          </h2>

          {/* Comparison cards (borrowed from the old wizard) */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <p className="text-[10px] font-body font-medium uppercase tracking-wider text-red-400 mb-1">
                You pay now (est.)
              </p>
              <p className="font-display font-bold text-brand-navy text-xl leading-none">
                {formatCents(quote.summary.currentMonthlyCents)}
              </p>
              <p className="text-[11px] text-brand-muted font-body mt-1">per month</p>
            </div>
            <div className="bg-brand-cyan/8 border border-brand-cyan/20 rounded-xl p-4">
              <p className="text-[10px] font-body font-medium uppercase tracking-wider text-brand-cyan mb-1">
                InsurIQ
              </p>
              <p className="font-display font-bold text-brand-navy text-xl leading-none">
                {formatCents(quote.summary.newMonthlyCents)}
              </p>
              <p className="text-[11px] text-brand-muted font-body mt-1">per month</p>
            </div>
          </div>

          {/* Savings highlight (mirrors the Report summary) */}
          <div className="bg-brand-navy rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs font-body uppercase tracking-wider mb-1">
                  Total savings per month
                </p>
                <p className="font-display font-bold text-white text-3xl leading-none">
                  {formatCents(quote.summary.savingMonthlyCents)}
                </p>
                <p className="text-white/60 text-sm font-body mt-1">
                  {formatCents(quote.summary.savingAnnualCents)} a year
                </p>
              </div>
              {savingPercent > 0 && (
                <div className="text-right">
                  <p className="font-display font-bold text-brand-cyan text-3xl leading-none">
                    {savingPercent}%
                  </p>
                  <p className="text-white/60 text-xs font-body mt-1">cheaper</p>
                </div>
              )}
            </div>
            {quote.summary.termSavingCents > 0 && (
              <p className="text-white/75 text-[13px] font-body mt-4 pt-4 border-t border-white/10">
                Roughly{' '}
                <span className="font-bold text-brand-cyan">
                  {formatCents(quote.summary.termSavingCents)}
                </span>{' '}
                over the next {quote.summary.yearsRemaining === 1 ? 'year' : `${quote.summary.yearsRemaining} years`}.
              </p>
            )}
          </div>

          {/* Account table (Rand amounts only — no rate columns) */}
          <div className="overflow-x-auto rounded-xl border-[1.5px] border-brand-border">
            <table className="w-full text-left font-body text-[13px] min-w-[560px]">
              <caption className="sr-only">Estimated credit life premiums and savings per account</caption>
              <thead>
                <tr className="bg-brand-cloud text-brand-navy text-[11px] uppercase tracking-wider">
                  <th scope="col" className="px-3 py-2.5 font-semibold">Account</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold text-right">Outstanding</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold text-right">Current est./mo</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold text-right">InsurIQ/mo</th>
                  <th scope="col" className="px-3 py-2.5 font-semibold text-right">Saving/mo</th>
                </tr>
              </thead>
              <tbody>
                {/* Index key: rows are a fixed server result, and provider + account
                    number is not unique (same provider twice, no account number). */}
                {quote.rows.map((row, index) => (
                  <tr key={index} className="border-t border-brand-border">
                    <td className="px-3 py-2.5">
                      <span className="block font-medium text-brand-navy">{row.provider}</span>
                      <span className="block text-[11px] text-brand-muted">
                        {creditTypeLabel(row.creditType)}
                      </span>
                      {row.alreadyBestRate && (
                        <span className="block text-[11px] text-brand-muted">
                          Already at our best rate
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">{formatCents(row.balanceCents)}</td>
                    <td className="px-3 py-2.5 text-right">
                      {formatCents(row.currentMonthlyCents)}
                      {row.isOwnFigure && (
                        <span className="block text-[10px] text-brand-muted">your figure</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">{formatCents(row.newMonthlyCents)}</td>
                    <td className="px-3 py-2.5 text-right font-semibold text-brand-navy">
                      {formatCents(row.savingMonthlyCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-brand-cloud font-semibold text-brand-navy border-t-2 border-brand-border">
                  <td className="px-3 py-2.5">Total</td>
                  <td className="px-3 py-2.5 text-right">{formatCents(quote.summary.totalBalanceCents)}</td>
                  <td className="px-3 py-2.5 text-right">{formatCents(quote.summary.currentMonthlyCents)}</td>
                  <td className="px-3 py-2.5 text-right">{formatCents(quote.summary.newMonthlyCents)}</td>
                  <td className="px-3 py-2.5 text-right">{formatCents(quote.summary.savingMonthlyCents)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="flex items-start gap-2 bg-brand-cloud rounded-xl p-4 mt-4">
            <Info className="w-4 h-4 text-brand-muted flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-[11px] text-brand-muted font-body leading-relaxed">
              Indicative estimate based on the balances you provided. Your actual premium is
              confirmed after assessment. InsurIQ is an Authorised Financial Services Provider.
            </p>
          </div>

          {/* Lead capture → PDF */}
          <form onSubmit={submitLead} className="mt-6" noValidate>
            <h3 className="font-display font-bold text-brand-navy text-lg mb-1">
              Email me my quote (PDF)
            </h3>
            <p className="text-brand-muted text-[13px] font-body mb-4">
              Your personalised quote, ready to share. No commitment.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="lead-first-name" className={labelBase}>First name</label>
                <input
                  id="lead-first-name"
                  type="text"
                  autoComplete="given-name"
                  value={lead.firstName}
                  onChange={(e) => setLead((prev) => ({ ...prev, firstName: e.target.value }))}
                  className={inputBase}
                  aria-invalid={Boolean(leadErrors.firstName)}
                />
                {leadErrors.firstName && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.firstName}</p>}
              </div>
              <div>
                <label htmlFor="lead-last-name" className={labelBase}>Surname</label>
                <input
                  id="lead-last-name"
                  type="text"
                  autoComplete="family-name"
                  value={lead.lastName}
                  onChange={(e) => setLead((prev) => ({ ...prev, lastName: e.target.value }))}
                  className={inputBase}
                  aria-invalid={Boolean(leadErrors.lastName)}
                />
                {leadErrors.lastName && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.lastName}</p>}
              </div>
              <div>
                <label htmlFor="lead-id-number" className={labelBase}>ID number</label>
                <input
                  id="lead-id-number"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="13 digits"
                  maxLength={13}
                  value={lead.idNumber}
                  onChange={(e) => setLead((prev) => ({ ...prev, idNumber: e.target.value.replace(/\D/g, '') }))}
                  className={inputBase}
                  aria-invalid={Boolean(leadErrors.idNumber)}
                  aria-describedby="lead-id-help"
                />
                <p id="lead-id-help" className="text-[11px] text-brand-muted font-body mt-1">
                  Encrypted and used only to prepare your quote.
                </p>
                {leadErrors.idNumber && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.idNumber}</p>}
              </div>
              <div>
                <label htmlFor="lead-email" className={labelBase}>Email</label>
                <input
                  id="lead-email"
                  type="email"
                  autoComplete="email"
                  value={lead.email}
                  onChange={(e) => setLead((prev) => ({ ...prev, email: e.target.value }))}
                  className={inputBase}
                  aria-invalid={Boolean(leadErrors.email)}
                />
                {leadErrors.email && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.email}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="lead-phone" className={labelBase}>Cellphone</label>
                <input
                  id="lead-phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="082 123 4567"
                  value={lead.phone}
                  onChange={(e) => setLead((prev) => ({ ...prev, phone: e.target.value }))}
                  className={inputBase}
                  aria-invalid={Boolean(leadErrors.phone)}
                />
                {leadErrors.phone && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.phone}</p>}
              </div>
            </div>

            {/* Honeypot — hidden from real users */}
            <div className="absolute w-0 h-0 overflow-hidden" aria-hidden="true">
              <label htmlFor="lead-website">Website</label>
              <input
                id="lead-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={lead.website}
                onChange={(e) => setLead((prev) => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <div className="mt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lead.consent}
                  onChange={(e) => setLead((prev) => ({ ...prev, consent: e.target.checked }))}
                  className="mt-1 w-4 h-4 accent-brand-cyan"
                  aria-invalid={Boolean(leadErrors.consent)}
                />
                <span className="text-[12px] text-brand-muted font-body leading-relaxed">
                  I consent to InsurIQ processing my personal information in accordance with their{' '}
                  <a href="/privacy-policy" className="text-brand-navy underline">Privacy Policy</a>{' '}
                  and POPIA.
                </span>
              </label>
              {leadErrors.consent && <p className="text-[12px] text-red-500 font-body mt-1">{leadErrors.consent}</p>}
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-[13px] text-red-600 font-body">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={phase === 'sending'}
              className={cn(
                'w-full h-[52px] mt-5 rounded-xl bg-brand-cyan text-brand-indigo font-body font-bold text-[15px]',
                'inline-flex items-center justify-center gap-2 transition-all duration-base ease-out',
                'hover:bg-brand-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed',
              )}
            >
              {phase === 'sending' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> Preparing your quote…
                </>
              ) : (
                <>
                  Email my quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </>
              )}
            </button>
            <p className="text-[11px] text-brand-muted font-body text-center mt-3">
              Free. No commitment. We respond within one business day.
            </p>
          </form>
        </div>
      )}

      {phase === 'sent' && quote && (
        <div className="text-center py-6" role="status">
          <div className="w-14 h-14 rounded-full bg-brand-cyan/15 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-brand-cyan" aria-hidden="true" />
          </div>
          <h2 className="font-display font-bold text-brand-navy text-2xl mb-2">
            {emailSent ? 'Your quote is on its way!' : 'Your details are with us'}
          </h2>
          <p className="text-brand-muted text-[14px] font-body max-w-sm mx-auto mb-6">
            {emailSent
              ? `Check your inbox — your personalised PDF quote showing ${formatCents(quote.summary.savingMonthlyCents)} monthly savings is waiting for you.`
              : `We've captured your quote showing ${formatCents(quote.summary.savingMonthlyCents)} monthly savings. An advisor will email it to you shortly.`}
          </p>
          <div className="bg-brand-cloud rounded-xl p-4 max-w-sm mx-auto mb-6 text-left">
            <div className="flex justify-between text-[13px] font-body mb-1.5">
              <span className="text-brand-muted">Savings per month</span>
              <span className="font-semibold text-brand-navy">{formatCents(quote.summary.savingMonthlyCents)}</span>
            </div>
            <div className="flex justify-between text-[13px] font-body">
              <span className="text-brand-muted">Savings per year</span>
              <span className="font-semibold text-brand-navy">{formatCents(quote.summary.savingAnnualCents)}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPhase('input')
              setQuote(null)
              setLead(EMPTY_LEAD)
            }}
            className="inline-flex items-center gap-2 h-[48px] px-6 rounded-xl border-[1.5px] border-brand-border text-brand-body font-body font-semibold text-[14px] hover:border-brand-cyan/40 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
          >
            <Check className="w-4 h-4" aria-hidden="true" /> Start a new quote
          </button>
        </div>
      )}

      {/* Trust badge */}
      <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-brand-border">
        <ShieldCheck className="w-4 h-4 text-brand-cyan" aria-hidden="true" />
        <p className="text-[11px] text-brand-muted font-body">
          FSCA Licensed Financial Services Provider · POPIA compliant
        </p>
      </div>
    </div>
  )
}
