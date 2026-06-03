import type { Metadata } from 'next'
import Link from 'next/link'
import { ShieldCheck, TrendingUp, BarChart3, CheckCircle2, XCircle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { CTABanner } from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'Insurance Products | InsurIQ',
  description:
    'Credit life insurance, financial advisory, and debt management from InsurIQ. FSCA licensed. Transparent pricing. South Africa.',
}

const CREDIT_LIFE_FEATURES = [
  'Vehicle finance cover',
  'Home loan protection',
  'Personal loan cover',
  'Retrenchment benefit included',
  'Up to 40% cheaper than bank rates',
  'Premium decreases as debt decreases',
]

const ADVISORY_FEATURES = [
  'FAIS-compliant financial advice',
  'Comprehensive risk assessment',
  'Short-term insurance review',
  'Financial planning and goal setting',
  'Personalised recommendations',
  'Ongoing advisory relationship',
]

const DEBT_FEATURES = [
  'Formal debt review process',
  'Debt mediation and negotiation',
  'Restructured repayment schedules',
  'Legal protection during review',
  'Credit bureau clearance on completion',
  'Path to financial freedom',
]

const COMPARISON_ROWS = [
  { feature: 'Transparent pricing', bank: false, insuriq: true },
  { feature: 'Digital application', bank: false, insuriq: true },
  { feature: 'FSCA licensed', bank: true, insuriq: true },
  { feature: 'Cost', bank: 'High', insuriq: 'Up to 40% less' },
  { feature: 'Application time', bank: 'Days', insuriq: '< 5 minutes' },
  { feature: 'Cancel anytime', bank: 'Varies', insuriq: true },
]

function Check() {
  return <CheckCircle2 className="w-5 h-5 text-brand-cyan" aria-label="Yes" />
}
function Cross() {
  return <XCircle className="w-5 h-5 text-red-400" aria-label="No" />
}
function CellValue({ value }: { value: boolean | string }) {
  if (value === true) return <Check />
  if (value === false) return <Cross />
  return <span className="text-sm font-body text-brand-body">{value}</span>
}

export default function ProductsPage() {
  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[45vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        aria-labelledby="products-heading"
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(93,205,230,0.10) 0%, transparent 65%)',
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
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-5">
            WHAT WE OFFER
          </p>
          <h1
            id="products-heading"
            className="font-display font-extrabold text-white text-balance mb-5 max-w-2xl"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            Three ways InsurIQ{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)' }}
            >
              protects
            </span>{' '}
            your future.
          </h1>
          <p className="text-[16px] text-white/65 font-body leading-relaxed max-w-xl">
            Transparent, affordable financial protection for South Africans with loans, financial
            goals, or debt concerns.
          </p>
        </Container>
      </section>

      {/* ── PRODUCTS DETAIL ── */}
      <section className="bg-white py-16 md:py-24">
        <Container>
          <div className="space-y-20 md:space-y-28">

            {/* Product 1 — Credit Life Insurance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Text left */}
              <div className="order-2 lg:order-1">
                <span className="inline-flex items-center bg-brand-cyan/10 text-brand-cyan rounded-full px-3 py-1 text-sm font-body font-medium mb-5">
                  Most Popular
                </span>
                <h2
                  className="font-display font-bold text-brand-navy tracking-tight mb-4"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
                >
                  Credit Life Insurance
                </h2>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-3">
                  Credit life insurance covers your outstanding debt if you are unable to repay due
                  to death, permanent disability, or retrenchment. Unlike the bundled cover your
                  bank quietly adds to your repayment, ours is transparent, standalone, and
                  significantly cheaper.
                </p>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-6">
                  Your premium decreases as your debt decreases — something your bank will never
                  offer with bundled cover.
                </p>
                <ul className="space-y-2 mb-8">
                  {CREDIT_LIFE_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                      <span className="text-[14px] text-brand-body font-body">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products/credit-life-insurance"
                  className="inline-flex items-center gap-1.5 text-brand-cyan font-body font-semibold hover:text-brand-blue transition-colors duration-[150ms] text-[15px]"
                >
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </div>
              {/* Visual right */}
              <div
                className="order-1 lg:order-2 bg-brand-navy rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[280px]"
              >
                <ShieldCheck className="w-20 h-20 text-brand-cyan/30 mb-5" aria-hidden="true" />
                <p className="font-display font-bold text-white text-2xl mb-1">Up to 40% cheaper</p>
                <p className="text-white/50 font-body text-sm">than your bank&apos;s bundled rate</p>
              </div>
            </div>

            {/* Product 2 — Financial Advisory */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Visual left */}
              <div
                className="bg-brand-blue rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[280px]"
              >
                <TrendingUp className="w-20 h-20 text-brand-bright/30 mb-5" aria-hidden="true" />
                <p className="font-display font-bold text-white text-2xl mb-1">FAIS Licensed</p>
                <p className="text-white/50 font-body text-sm">Advisory you can trust</p>
              </div>
              {/* Text right */}
              <div>
                <h2
                  className="font-display font-bold text-brand-navy tracking-tight mb-4"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
                >
                  Financial Advisory
                </h2>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-3">
                  FSCA-licensed financial advice tailored to your situation and goals. We help you
                  understand your full financial picture — from risk exposure to insurance gaps —
                  and provide recommendations that are in your interest, not ours.
                </p>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-6">
                  Our advisors are FAIS-compliant and legally required to disclose all fees and
                  conflicts of interest before rendering any service.
                </p>
                <ul className="space-y-2 mb-8">
                  {ADVISORY_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                      <span className="text-[14px] text-brand-body font-body">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products/financial-advisory"
                  className="inline-flex items-center gap-1.5 text-brand-cyan font-body font-semibold hover:text-brand-blue transition-colors duration-[150ms] text-[15px]"
                >
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Product 3 — Debt Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Text left */}
              <div>
                <h2
                  className="font-display font-bold text-brand-navy tracking-tight mb-4"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
                >
                  Debt Management
                </h2>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-3">
                  If your debt has become unmanageable, debt review gives you legal protection from
                  creditors while a debt counsellor restructures your repayments into a single,
                  affordable payment you can actually live with.
                </p>
                <p className="text-[15px] text-brand-body font-body leading-relaxed mb-6">
                  Debt mediation is an alternative for those who do not qualify for formal debt
                  review but still need professional help negotiating with creditors.
                </p>
                <ul className="space-y-2 mb-8">
                  {DEBT_FEATURES.map((f) => (
                    <li key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                      <span className="text-[14px] text-brand-body font-body">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/products/debt-management"
                  className="inline-flex items-center gap-1.5 text-brand-cyan font-body font-semibold hover:text-brand-blue transition-colors duration-[150ms] text-[15px]"
                >
                  Learn More <span aria-hidden="true">→</span>
                </Link>
              </div>
              {/* Visual right */}
              <div
                className="bg-brand-indigo rounded-2xl p-10 flex flex-col items-center justify-center text-center min-h-[280px]"
              >
                <BarChart3 className="w-20 h-20 text-brand-cyan/20 mb-5" aria-hidden="true" />
                <p className="font-display font-bold text-white text-2xl mb-1">
                  Your path to debt freedom
                </p>
                <p className="text-white/50 font-body text-sm">Structured, legal, dignified</p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-16 md:py-24 bg-brand-cloud">
        <Container>
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              THE DIFFERENCE
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
            >
              How does InsurIQ compare?
            </h2>
          </div>

          {/* Mobile: card rows */}
          <div className="lg:hidden max-w-lg mx-auto space-y-3">
            {COMPARISON_ROWS.map(({ feature, bank, insuriq }) => (
              <div key={feature} className="bg-white rounded-2xl p-5 shadow-card">
                <p className="text-xs font-body font-medium uppercase tracking-wider text-brand-muted mb-3">
                  {feature}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-brand-muted font-body mb-1.5">Your Bank</p>
                    <div className="flex justify-center"><CellValue value={bank} /></div>
                  </div>
                  <div className="w-px h-8 bg-brand-border" aria-hidden="true" />
                  <div className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-brand-cyan font-body font-medium mb-1.5">InsurIQ</p>
                    <div className="flex justify-center"><CellValue value={insuriq} /></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: proper table */}
          <div className="hidden lg:block max-w-3xl mx-auto">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-card text-left">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="px-6 py-4 font-body font-semibold text-brand-navy text-sm">Feature</th>
                  <th className="px-6 py-4 font-body font-semibold text-brand-muted text-sm text-center">Your Bank</th>
                  <th className="px-6 py-4 font-body font-bold text-brand-cyan text-sm text-center bg-brand-navy/[0.03]">InsurIQ</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(({ feature, bank, insuriq }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-cloud/40'}>
                    <td className="px-6 py-4 font-body text-[15px] text-brand-body">{feature}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center"><CellValue value={bank} /></div>
                    </td>
                    <td className="px-6 py-4 text-center bg-brand-navy/[0.02]">
                      <div className="flex justify-center"><CellValue value={insuriq} /></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <CTABanner />
    </>
  )
}
