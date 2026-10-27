'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, LockKeyhole } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { LOAN_TYPES, quickQuoteSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'

const HEADING = 'Ready to pay less for better cover?'
const HEADING_DESKTOP = 'Ready to insure smarter?'
const SUBHEADING =
  'Get your personalised quote in under 60 seconds. No spam. No pressure. Just clarity.'
const EYEBROW = 'GET STARTED'

const TRUST_ITEMS = [
  'FSCA Licensed Financial Services Provider',
  'POPIA-compliant data handling',
  'No commitment until you sign',
]

interface FormState {
  name: string
  phone: string
  loanType: string
  consent: boolean
}

type Field = keyof FormState
type FieldErrors = Partial<Record<Field, string>>

interface FieldIssue {
  path: string
  message: string
}

const FIELDS: readonly Field[] = ['name', 'phone', 'loanType', 'consent']

/** First message per field, from client (zod) or server (422) issues alike. */
function toFieldErrors(issues: readonly FieldIssue[]): FieldErrors {
  const errors: FieldErrors = {}
  for (const issue of issues) {
    const field = FIELDS.find((name) => name === issue.path)
    if (field && !errors[field]) errors[field] = issue.message
  }
  return errors
}

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

interface FieldErrorProps {
  id: string
  message?: string
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p id={id} className="text-xs text-red-500 font-body mt-1">
      {message}
    </p>
  )
}

const inputClass = cn(
  'w-full px-4 rounded-xl min-h-[52px]',
  'bg-white border-[1.5px] border-brand-border',
  'text-brand-ink text-[16px] font-body',
  'placeholder:text-brand-muted',
  'focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_0_3px_rgba(93,205,230,0.15)]',
  'transition-colors duration-[150ms]',
  'disabled:opacity-50',
)

export function CTABanner() {
  const prefersReduced = useReducedMotion()
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    loanType: '',
    consent: false,
  })
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})

  function update<K extends Field>(field: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Client-side pre-check with the server's own schema.
    const result = quickQuoteSchema.safeParse(form)
    if (!result.success) {
      setErrors(
        toFieldErrors(
          result.error.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
        ),
      )
      return
    }

    setErrors({})
    setStatus('loading')
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...result.data, source: 'cta-banner' }),
      })
      if (res.status === 422) {
        const data = (await res.json()) as { issues?: FieldIssue[] }
        const fieldErrors = toFieldErrors(data.issues ?? [])
        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors)
          setStatus('idle')
          return
        }
      }
      if (!res.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      className="relative overflow-hidden py-16 md:py-28 lg:py-32"
      style={{
        background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)',
      }}
      aria-labelledby="cta-heading"
    >
      {/* Decorative glow */}
      <div
        className="absolute top-0 right-0 w-[400px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at top right, rgba(93,205,230,0.12) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <Container className="relative">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start"
          initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          {/* ── Form card — order-1 on mobile (comes first), order-2 on desktop ── */}
          <div className="order-1 lg:order-2 bg-white rounded-2xl p-6 lg:p-8 shadow-2xl">
            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-brand-cyan" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-brand-navy text-xl mb-2">
                  Quote request received!
                </h3>
                <p className="text-body text-brand-muted font-body">
                  We&apos;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="font-display font-bold text-brand-navy text-xl mb-1">
                  Get my free quote
                </h3>
                <p className="text-brand-muted text-sm font-body mb-5">
                  Takes less than 60 seconds
                </p>

                <div className="space-y-4 mb-5">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="cta-name"
                      className="block text-body-sm font-medium text-brand-navy font-body mb-1.5"
                    >
                      Full name
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Jane Smith"
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'cta-name-error' : undefined}
                      disabled={status === 'loading'}
                      className={inputClass}
                    />
                    <FieldError id="cta-name-error" message={errors.name} />
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="cta-phone"
                      className="block text-body-sm font-medium text-brand-navy font-body mb-1.5"
                    >
                      Phone number
                    </label>
                    <input
                      id="cta-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="072 000 0000"
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'cta-phone-error' : undefined}
                      disabled={status === 'loading'}
                      className={inputClass}
                    />
                    <FieldError id="cta-phone-error" message={errors.phone} />
                  </div>

                  {/* Loan type */}
                  <div>
                    <label
                      htmlFor="cta-loan-type"
                      className="block text-body-sm font-medium text-brand-navy font-body mb-1.5"
                    >
                      Loan type
                    </label>
                    <select
                      id="cta-loan-type"
                      value={form.loanType}
                      onChange={(e) => update('loanType', e.target.value)}
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.loanType)}
                      aria-describedby={errors.loanType ? 'cta-loan-type-error' : undefined}
                      disabled={status === 'loading'}
                      className={cn(inputClass, 'cursor-pointer')}
                    >
                      <option value="" disabled>
                        Select loan type
                      </option>
                      {LOAN_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <FieldError id="cta-loan-type-error" message={errors.loanType} />
                  </div>

                  {/* POPIA consent */}
                  <div className="flex items-start gap-3 pt-1">
                    <input
                      id="cta-consent"
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update('consent', e.target.checked)}
                      required
                      aria-required="true"
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={errors.consent ? 'cta-consent-error' : undefined}
                      disabled={status === 'loading'}
                      className="mt-1 w-4 h-4 accent-brand-cyan flex-shrink-0"
                    />
                    <label
                      htmlFor="cta-consent"
                      className="text-[11px] text-brand-muted font-body leading-relaxed"
                    >
                      I consent to InsurIQ collecting and processing my personal
                      information in accordance with their{' '}
                      <Link
                        href="/privacy-policy"
                        className="text-brand-blue underline hover:text-brand-navy"
                      >
                        Privacy Policy
                      </Link>{' '}
                      and in compliance with POPIA.
                    </label>
                  </div>
                  <FieldError id="cta-consent-error" message={errors.consent} />
                </div>

                {status === 'error' && (
                  <p role="alert" className="text-body-sm text-red-500 font-body mb-4">
                    Something went wrong. Please try again or{' '}
                    <Link href="/contact" className="underline hover:text-brand-navy">
                      contact us directly
                    </Link>
                    .
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={cn(
                    'w-full h-[52px] px-6 rounded-xl',
                    'bg-brand-navy text-white',
                    'font-body font-bold text-[15px]',
                    'transition-all duration-[250ms] ease-out',
                    'hover:bg-[#0d3590] hover:shadow-btn-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                  aria-busy={status === 'loading'}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        aria-hidden="true"
                      />
                      Submitting…
                    </span>
                  ) : (
                    'Get My Free Quote'
                  )}
                </button>

                <div className="flex items-center gap-2 mt-3 justify-center">
                  <LockKeyhole
                    className="w-3.5 h-3.5 text-brand-muted flex-shrink-0"
                    aria-hidden="true"
                  />
                  <p className="text-[11px] text-brand-muted font-body text-center">
                    Your data is encrypted and protected under POPIA.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* ── Copy — order-2 on mobile (below form), order-1 on desktop ── */}
          <div className="order-2 lg:order-1">
            {/* Mobile heading (shorter) */}
            <h2
              id="cta-heading"
              className="font-display font-bold text-white tracking-tight leading-tight mb-3 lg:hidden"
              style={{ fontSize: '28px' }}
            >
              {HEADING}
            </h2>

            {/* Desktop heading + eyebrow */}
            <div className="hidden lg:block">
              <p className="text-label font-medium uppercase tracking-widest text-brand-cyan mb-4 font-body">
                {EYEBROW}
              </p>
              <h2
                className="font-display font-bold text-white tracking-tight text-balance mb-4"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1 }}
              >
                {HEADING_DESKTOP}
              </h2>
            </div>

            <p className="text-[14px] lg:text-body-lg text-white/60 font-body leading-relaxed mb-6 lg:mb-10">
              {SUBHEADING}
            </p>

            {/* Trust items — 2 on mobile, all 3 on desktop */}
            <ul className="flex flex-col gap-2 lg:gap-4">
              {TRUST_ITEMS.slice(0, 2).map((item) => (
                <li key={item} className="flex items-center gap-3 lg:hidden">
                  <CheckCircle2
                    className="w-4 h-4 text-brand-cyan flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-white/70 font-body">{item}</span>
                </li>
              ))}
              {TRUST_ITEMS.map((item) => (
                <li key={item} className="hidden lg:flex items-center gap-3">
                  <CheckCircle2
                    className="w-5 h-5 text-brand-cyan flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-body text-white/75 font-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}
