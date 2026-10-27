'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, Loader2, MessageCircle } from 'lucide-react'
import { LOAN_TYPES, contactFormSchema, type ContactFormData } from '@/lib/validations'
import { WHATSAPP_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'

const LOAN_AMOUNTS = [
  { value: 'under-50k', label: 'Under R50,000' },
  { value: '50k-150k', label: 'R50,000 – R150,000' },
  { value: '150k-500k', label: 'R150,000 – R500,000' },
  { value: '500k-1m', label: 'R500,000 – R1,000,000' },
  { value: 'over-1m', label: 'Over R1,000,000' },
]

const inputClass = cn(
  'w-full px-4 rounded-xl min-h-[52px]',
  'bg-white border-[1.5px] border-brand-border',
  'text-brand-ink text-[16px] font-body',
  'placeholder:text-brand-muted',
  'focus:outline-none focus:border-brand-cyan focus:shadow-[0_0_0_3px_rgba(93,205,230,0.15)]',
  'transition-colors duration-[150ms]',
  'disabled:opacity-50',
)

const errorInputClass = 'border-red-400 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]'

interface FieldErrorProps {
  message?: string
}

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null
  return (
    <p className="flex items-center gap-1 text-red-500 text-xs mt-1 font-body" role="alert">
      <AlertCircle className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

export function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [firstName, setFirstName] = useState('')
  const [messageLength, setMessageLength] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      loanType: undefined,
      loanAmount: '',
      message: '',
      consent: undefined,
    },
  })

  async function onSubmit(data: ContactFormData) {
    setSubmitStatus('loading')
    setFirstName(data.firstName)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'contact-form' }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    }
  }

  if (submitStatus === 'success') {
    return (
      <div className="text-center py-10">
        <div className="w-20 h-20 rounded-full bg-brand-cyan/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-brand-cyan" aria-hidden="true" />
        </div>
        <h3 className="font-display font-bold text-2xl text-brand-navy mb-3">
          Thank you, {firstName}!
        </h3>
        <p className="text-brand-muted font-body leading-relaxed mb-8 max-w-sm mx-auto">
          We&apos;ve received your enquiry and will be in touch within one business day.
        </p>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 px-6 py-3 rounded-xl',
            'bg-[#25D366] text-white font-body font-semibold',
            'hover:bg-[#20b859] transition-colors duration-[150ms]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2',
          )}
        >
          <MessageCircle className="w-5 h-5" aria-hidden="true" />
          Or chat with us now on WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="font-display font-bold text-brand-navy text-xl mb-1">
        Get your free quote
      </h2>
      <p className="text-brand-muted text-sm font-body mb-6">
        We&apos;ll get back to you within one business day.
      </p>

      <div className="space-y-4">
        {/* First + Last name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Jane"
              disabled={submitStatus === 'loading'}
              {...register('firstName')}
              className={cn(inputClass, errors.firstName && errorInputClass)}
              aria-invalid={!!errors.firstName}
            />
            <FieldError message={errors.firstName?.message} />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Smith"
              disabled={submitStatus === 'loading'}
              {...register('lastName')}
              className={cn(inputClass, errors.lastName && errorInputClass)}
              aria-invalid={!!errors.lastName}
            />
            <FieldError message={errors.lastName?.message} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            disabled={submitStatus === 'loading'}
            {...register('email')}
            className={cn(inputClass, errors.email && errorInputClass)}
            aria-invalid={!!errors.email}
          />
          <FieldError message={errors.email?.message} />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="072 000 0000"
            disabled={submitStatus === 'loading'}
            {...register('phone')}
            className={cn(inputClass, errors.phone && errorInputClass)}
            aria-invalid={!!errors.phone}
          />
          <FieldError message={errors.phone?.message} />
        </div>

        {/* Loan type */}
        <div>
          <label htmlFor="loanType" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
            Loan type
          </label>
          <select
            id="loanType"
            disabled={submitStatus === 'loading'}
            {...register('loanType')}
            className={cn(inputClass, 'cursor-pointer', errors.loanType && errorInputClass)}
            aria-invalid={!!errors.loanType}
            defaultValue=""
          >
            <option value="" disabled>Select loan type</option>
            {LOAN_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <FieldError message={errors.loanType?.message} />
        </div>

        {/* Loan amount */}
        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
            Approximate loan amount
          </label>
          <select
            id="loanAmount"
            disabled={submitStatus === 'loading'}
            {...register('loanAmount')}
            className={cn(inputClass, 'cursor-pointer', errors.loanAmount && errorInputClass)}
            aria-invalid={!!errors.loanAmount}
            defaultValue=""
          >
            <option value="" disabled>Select amount range</option>
            {LOAN_AMOUNTS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <FieldError message={errors.loanAmount?.message} />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-brand-navy font-body mb-1.5">
            Message <span className="text-brand-muted font-normal">(optional)</span>
          </label>
          <div className="relative">
            <textarea
              id="message"
              rows={4}
              placeholder="Tell us a bit more about your situation..."
              disabled={submitStatus === 'loading'}
              {...register('message', {
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setMessageLength(e.target.value.length),
              })}
              className={cn(
                inputClass,
                'min-h-0 py-3 resize-none',
                errors.message && errorInputClass,
              )}
              maxLength={500}
              aria-invalid={!!errors.message}
            />
            <span className="absolute bottom-2 right-3 text-[11px] text-brand-muted font-body">
              {messageLength}/500
            </span>
          </div>
          <FieldError message={errors.message?.message} />
        </div>

        {/* POPIA consent */}
        <div className="flex items-start gap-3 pt-1">
          <input
            id="consent"
            type="checkbox"
            disabled={submitStatus === 'loading'}
            {...register('consent')}
            className="mt-1 w-4 h-4 accent-brand-cyan flex-shrink-0"
            aria-invalid={!!errors.consent}
          />
          <label htmlFor="consent" className="text-xs text-brand-muted font-body leading-relaxed">
            I consent to InsurIQ collecting and processing my personal information in accordance
            with their{' '}
            <Link href="/privacy-policy" className="text-brand-blue underline hover:text-brand-navy">
              Privacy Policy
            </Link>{' '}
            and in compliance with POPIA.
          </label>
        </div>
        <FieldError message={errors.consent?.message} />
      </div>

      {submitStatus === 'error' && (
        <p role="alert" className="flex items-center gap-2 text-red-500 text-sm font-body mt-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          Something went wrong. Please try again or{' '}
          <a href={WHATSAPP_URL} className="underline hover:text-red-700" target="_blank" rel="noopener noreferrer">
            contact us on WhatsApp
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={submitStatus === 'loading'}
        className={cn(
          'w-full mt-6 h-[52px] px-6 rounded-xl',
          'bg-brand-navy text-white',
          'font-body font-bold text-[15px]',
          'transition-all duration-[250ms] ease-out',
          'hover:bg-[#0d3590] hover:shadow-btn-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        )}
        aria-busy={submitStatus === 'loading'}
      >
        {submitStatus === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending…
          </span>
        ) : (
          'Send My Enquiry'
        )}
      </button>
    </form>
  )
}
