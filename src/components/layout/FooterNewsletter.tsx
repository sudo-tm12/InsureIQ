'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { newsletterSchema } from '@/lib/validations'
import { cn } from '@/lib/utils'

type SubmitStatus = 'idle' | 'loading' | 'success' | 'error'

const GENERIC_ERROR = 'Something went wrong. Please try again.'

export function FooterNewsletter() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // Client-side pre-check with the server's own schema.
    const result = newsletterSchema.safeParse({ email, consent })
    if (!result.success) {
      setStatus('error')
      setError(result.error.issues[0]?.message ?? GENERIC_ERROR)
      return
    }

    setStatus('loading')
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      })
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error ?? GENERIC_ERROR)
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : GENERIC_ERROR)
    }
  }

  if (status === 'success') {
    return (
      <p role="status" className="text-sm text-brand-cyan font-body">
        You&apos;re on the list. We&apos;ll be in touch.
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      noValidate
      aria-label="Newsletter subscription"
    >
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-required="true"
          aria-describedby={error ? 'newsletter-error' : undefined}
          disabled={status === 'loading'}
          className={cn(
            'flex-1 min-w-0 px-4 py-2.5 rounded-lg text-sm font-body',
            'bg-white/10 border border-white/20',
            'text-white placeholder:text-white/40',
            'focus:outline-none focus:border-brand-cyan focus:bg-white/15',
            'transition-colors duration-[150ms]',
            'disabled:opacity-50',
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          aria-label="Subscribe to newsletter"
          className={cn(
            'px-4 py-2.5 rounded-lg',
            'bg-brand-cyan text-brand-indigo',
            'font-body font-semibold text-sm',
            'hover:bg-white hover:text-brand-navy',
            'transition-colors duration-[150ms]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-indigo',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'flex items-center justify-center',
          )}
        >
          {status === 'loading' ? (
            <span
              className="w-4 h-4 border-2 border-brand-indigo/30 border-t-brand-indigo rounded-full animate-spin"
              aria-hidden="true"
            />
          ) : (
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* POPIA consent — never pre-checked */}
      <div className="flex items-start gap-3">
        <input
          id="newsletter-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          required
          aria-required="true"
          disabled={status === 'loading'}
          className="mt-1 w-4 h-4 accent-brand-cyan flex-shrink-0"
        />
        <label
          htmlFor="newsletter-consent"
          className="text-xs text-white/55 font-body leading-relaxed"
        >
          I consent to InsurIQ processing my personal information in accordance with their{' '}
          <Link href="/privacy-policy" className="text-white/80 underline hover:text-white">
            Privacy Policy
          </Link>{' '}
          and POPIA.
        </label>
      </div>

      {error && (
        <p id="newsletter-error" role="alert" className="text-xs text-red-400 font-body">
          {error}
        </p>
      )}
    </form>
  )
}
