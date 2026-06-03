import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { QuoteCalculator } from '@/components/forms/QuoteCalculator'

export const metadata: Metadata = {
  title: 'Get a Quote | InsurIQ',
  description:
    'See how much you could save on credit life insurance. Instant estimate. No commitment. FSCA licensed.',
}

const BENEFITS = [
  'Risk-rated, personalised estimate',
  'No credit check required',
  'No commitment until you sign',
  'FSCA licensed and regulated',
]

export default function GetQuotePage() {
  return (
    <div className="bg-brand-cloud min-h-screen">
      {/* Dark hero */}
      <div
        className="relative pt-32 pb-16 md:pt-44 md:pb-24 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(93,205,230,0.12) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />
        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left: copy */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-5">
                FREE ESTIMATE
              </p>
              <h1
                className="font-display font-extrabold text-white text-balance mb-5"
                style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
              >
                See how much you{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)' }}
                >
                  could save.
                </span>
              </h1>
              <p className="text-[16px] text-white/65 font-body leading-relaxed mb-8 max-w-md">
                Tell us about your loan, yourself and the cover you want. We&apos;ll show you an
                estimate of what you&apos;re likely overpaying — and what InsurIQ would cost instead.
              </p>
              <ul className="space-y-3">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                    <span className="text-[14px] text-white/70 font-body">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: calculator */}
            <div>
              <QuoteCalculator />
            </div>

          </div>
        </Container>
      </div>

      {/* Explainer strip below fold */}
      <Container className="py-12 md:py-16">
        <p className="text-center text-sm text-brand-muted font-body max-w-2xl mx-auto leading-relaxed">
          <strong className="text-brand-navy">How we calculate this:</strong> South African credit life
          premiums are capped by the National Credit Act at R4.50 per R1,000 owed (R2.00 per R1,000 on
          home loans) — most lenders charge the maximum. We compare that benchmark against InsurIQ&apos;s
          risk-rated pricing for your age, cover and balance. Your actual premium is confirmed in your
          personalised quote.
        </p>
      </Container>
    </div>
  )
}
