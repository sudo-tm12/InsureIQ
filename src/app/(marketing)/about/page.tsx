import type { Metadata } from 'next'
import { Eye, TrendingDown, BadgeCheck, ShieldCheck, FileText, AlertTriangle } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { REGULATORY, LEGAL_LINKS } from '@/lib/constants'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About InsurIQ | Our Story & Mission',
  description:
    'InsurIQ was built to fix what\'s broken in credit life insurance. Learn about our mission to bring affordable, transparent cover to South Africans.',
}

const VALUES = [
  {
    icon: Eye,
    title: 'Transparency',
    body: 'We explain every rand, every term, in plain language. No jargon, no fine print surprises.',
  },
  {
    icon: TrendingDown,
    title: 'Affordability',
    body: 'We compare the market so you always pay less. Our rates decrease as your debt decreases.',
  },
  {
    icon: BadgeCheck,
    title: 'Accountability',
    body: 'As an FSCA-licensed FSP, we are legally answerable to you. Your protection is not optional for us.',
  },
]

const CREDENTIALS = [
  {
    icon: ShieldCheck,
    title: 'FSCA Authorised',
    body: `${REGULATORY.registeredName} is an Authorised Financial Services Provider operating under the Financial Advisory and Intermediary Services Act (FAIS). FSP No: ${REGULATORY.fspNumber}.`,
  },
  {
    icon: FileText,
    title: 'POPIA Compliant',
    body: 'We handle all personal information in strict compliance with the Protection of Personal Information Act. Your data is never sold or shared without explicit consent.',
  },
  {
    icon: AlertTriangle,
    title: 'FAIS Disclosure',
    body: 'In terms of FAIS, we are required to provide you with full disclosure before rendering any financial service. Our complete FAIS disclosure is available at all times.',
    link: { label: 'Read our FAIS Disclosure', href: '/fais-disclosure' },
  },
]

export default function AboutPage() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[50vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        aria-labelledby="about-heading"
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
            OUR STORY
          </p>
          <h1
            id="about-heading"
            className="font-display font-extrabold text-white text-balance mb-5 max-w-2xl"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            Built for South Africans who deserve better.
          </h1>
          <p className="text-[16px] text-white/65 font-body leading-relaxed max-w-xl">
            InsurIQ was founded on a simple belief: credit life insurance should be affordable,
            transparent, and built around the client — not the bank.
          </p>
        </Container>
      </section>

      {/* ── 2. MISSION ── */}
      <section className="py-16 md:py-24 lg:py-32 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: large decorative stat */}
            <div className="relative flex items-center justify-center lg:justify-start">
              <div className="relative">
                <span
                  className="font-display font-bold text-brand-navy/[0.06] leading-none select-none"
                  style={{ fontSize: 'clamp(100px, 18vw, 160px)' }}
                  aria-hidden="true"
                >
                  40%
                </span>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p
                    className="font-display font-bold text-brand-navy text-center leading-tight"
                    style={{ fontSize: 'clamp(24px, 4vw, 36px)' }}
                  >
                    Up to 40% cheaper
                  </p>
                  <p className="text-brand-muted font-body text-center text-sm mt-2 max-w-[220px] leading-snug">
                    than traditional bundled credit life rates
                  </p>
                </div>
              </div>
            </div>

            {/* Right: mission copy */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                OUR MISSION
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight text-balance mb-5"
                style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
              >
                Fixing what&apos;s broken in credit life insurance.
              </h2>
              <div className="space-y-4 text-[15px] text-brand-body font-body leading-relaxed mb-8">
                <p>
                  South African banks have bundled credit life insurance into loan repayments for
                  decades — often without clearly explaining what clients are paying for or giving
                  them a choice. The result: millions of South Africans are overinsured, underserved,
                  and paying too much.
                </p>
                <p>
                  InsurIQ was built to change that. We are a technology-driven financial services
                  provider that puts clarity, affordability, and client choice at the centre of every
                  interaction. We are not a bank. We are not a broker who gets paid to push products.
                  We are on your side.
                </p>
              </div>

              {/* Pull quote */}
              <blockquote className="bg-brand-cloud rounded-xl p-6 border-l-4 border-brand-cyan">
                <p className="italic text-brand-navy font-body leading-relaxed text-[15px]">
                  &ldquo;Every South African with a loan deserves to know exactly what they&apos;re
                  paying for — and why.&rdquo;
                </p>
              </blockquote>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 3. VALUES ── */}
      <section className="py-16 md:py-24 lg:py-28 bg-brand-cloud">
        <Container>
          <div className="text-center mb-12 lg:mb-16">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              WHAT WE STAND FOR
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
            >
              Three principles. No compromise.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {VALUES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl p-8 shadow-card hover:-translate-y-1 hover:shadow-card-hover transition-all duration-[250ms]"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-brand-cyan" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-brand-navy text-xl mb-3">{title}</h3>
                <p className="text-[15px] text-brand-body font-body leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 4. REGULATORY CREDENTIALS ── */}
      <section className="py-16 md:py-24 lg:py-28 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: heading + intro */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                COMPLIANCE & LICENSING
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight text-balance mb-5"
                style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
              >
                Fully regulated & compliant.
              </h2>
              <p className="text-[15px] text-brand-body font-body leading-relaxed mb-8">
                InsurIQ operates under the full regulatory framework of South Africa&apos;s financial
                services sector. Every product we offer, every piece of advice we give, and every
                client interaction is governed by FSCA and FAIS requirements.
              </p>

              {/* Compliance links */}
              <div className="bg-brand-cloud rounded-2xl p-6">
                <h3 className="font-display font-bold text-brand-navy text-base mb-4">
                  Compliance documents
                </h3>
                <ul className="space-y-3">
                  {LEGAL_LINKS.map(({ label, href }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="flex items-center gap-2 text-sm text-brand-blue font-body hover:text-brand-navy transition-colors duration-[150ms] group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan flex-shrink-0 group-hover:scale-125 transition-transform duration-[150ms]" aria-hidden="true" />
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: credential cards */}
            <div className="space-y-5">
              {CREDENTIALS.map(({ icon: Icon, title, body, link }) => (
                <div
                  key={title}
                  className="flex items-start gap-5 bg-brand-cloud rounded-2xl p-6"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-navy/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-brand-navy" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-base mb-2">{title}</h3>
                    <p className="text-[14px] text-brand-body font-body leading-relaxed">{body}</p>
                    {link && (
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 mt-2 text-sm text-brand-blue font-body font-medium hover:text-brand-navy transition-colors duration-[150ms]"
                      >
                        {link.label} →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-16 md:py-20 text-center"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <Container>
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
            READY TO START
          </p>
          <h2
            className="font-display font-bold text-white text-balance mb-4"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}
          >
            Get your free quote today.
          </h2>
          <p className="text-[15px] text-white/60 font-body mb-8 max-w-md mx-auto">
            No obligation. No jargon. Just clear, affordable cover from an FSP you can trust.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white text-brand-navy font-body font-bold text-[15px] hover:bg-brand-cyan hover:text-white transition-all duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-indigo"
          >
            Contact Us Now
          </Link>
        </Container>
      </section>
    </>
  )
}
