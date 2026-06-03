import type { Metadata } from 'next'
import { Clock, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { CTABanner } from '@/components/sections/CTABanner'

export const metadata: Metadata = {
  title: 'How InsurIQ Works | Quote to Covered in Minutes',
  description:
    'See exactly how InsurIQ works — four simple steps from quote to active cover. FSCA licensed. No paperwork. Under 5 minutes.',
}

interface Step {
  number: string
  title: string
  description: string
  time: string
  need: string
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Get a Quote',
    description:
      'Answer a few simple questions about your loan and personal situation. No credit checks at this stage — just enough to generate your personalised quote.',
    time: 'Takes about 60 seconds',
    need: 'Your loan type and approximate balance',
  },
  {
    number: '02',
    title: 'Choose Your Cover',
    description:
      'Review your quote in full — every rand, every benefit, every exclusion explained in plain language. Compare options and choose the cover that fits your situation and budget.',
    time: 'Takes about 2 minutes',
    need: 'Just your decision — no paperwork yet',
  },
  {
    number: '03',
    title: 'Sign Digitally',
    description:
      'Complete your application online. Upload your ID and bank details securely. Sign your policy document digitally — fully POPIA-compliant, no printer required.',
    time: 'Takes about 2 minutes',
    need: 'SA ID, bank account details, loan account number',
  },
  {
    number: '04',
    title: "You're Covered",
    description:
      "Your policy is active immediately. Documents delivered to your inbox. Your debt is protected — and you'll pay significantly less than your bank was charging.",
    time: 'Instant on approval',
    need: "Nothing — you're done",
  },
]

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'How long does the full application take?',
    answer:
      'Most applications are completed in under 5 minutes from start to active policy. Step 1 (quote) takes about 60 seconds. Steps 2 and 3 (choosing and signing) take another 3–4 minutes. That\'s it.',
  },
  {
    question: 'What does credit life insurance cover?',
    answer:
      'Credit life insurance pays off your outstanding loan balance — or covers your monthly repayments — if you die, become permanently disabled, or are retrenched. It protects your family from inheriting your debt and protects your credit record during difficult times.',
  },
  {
    question: "How is InsurIQ different from my bank's credit life cover?",
    answer:
      'Banks bundle credit life insurance into your repayment without clearly disclosing the cost. InsurIQ offers standalone, transparent cover — typically 30–40% cheaper — with a full breakdown of exactly what you pay and what you\'re covered for.',
  },
  {
    question: 'Is InsurIQ regulated by the FSCA?',
    answer:
      'Yes. InsurIQ is an Authorised Financial Services Provider licensed by the FSCA under FAIS. We are legally required to act in your best interest, disclose all fees, and treat you fairly at every stage.',
  },
  {
    question: 'Can I cancel my policy at any time?',
    answer:
      'Yes. There is no lock-in period or cancellation penalty. You can cancel with 30 days notice at any time. We believe in earning your business every month — not trapping you in it.',
  },
  {
    question: 'What do I need to apply?',
    answer:
      'You will need: your South African ID number, your loan account number and outstanding balance, your bank account details for debit order setup, and a valid email address and phone number. That\'s it — no physical documents needed at application stage.',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* ── 1. HERO ── */}
      <section
        className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[45vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        aria-labelledby="hiw-heading"
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
            THE PROCESS
          </p>
          <h1
            id="hiw-heading"
            className="font-display font-extrabold text-white text-balance mb-5 max-w-2xl"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            From quote to covered{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)' }}
            >
              in minutes.
            </span>
          </h1>
          <p className="text-[16px] text-white/65 font-body leading-relaxed max-w-xl">
            No paperwork. No waiting rooms. No confusing jargon. Just straightforward cover that
            protects what matters.
          </p>
        </Container>
      </section>

      {/* ── 2. EXPANDED STEPS ── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          {/* Section heading */}
          <div className="text-center mb-12 md:mb-16">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              STEP BY STEP
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance mb-3"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
            >
              {"Here's exactly what happens"}
            </h2>
            <p className="text-[15px] text-brand-muted font-body">
              Four steps. Under five minutes total.
            </p>
          </div>

          {/* Step cards */}
          <div className="max-w-3xl mx-auto space-y-6">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex items-start gap-5 md:gap-7 bg-white rounded-2xl p-6 md:p-8 border-l-4 border-brand-cyan"
                style={{ boxShadow: '0 2px 16px rgba(11,45,120,0.06)' }}
              >
                {/* Circle */}
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-white text-sm leading-none">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-brand-cyan text-[10px] font-body font-medium tracking-widest uppercase mb-1">
                    STEP {step.number}
                  </p>
                  <h3 className="font-display font-bold text-brand-navy text-xl mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[15px] text-brand-muted font-body leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Details row */}
                  <div className="flex flex-wrap gap-x-6 gap-y-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-brand-muted font-body">{step.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                      <span className="text-sm text-brand-muted font-body">{step.need}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── 3. FAQ ACCORDION ── */}
      <section className="py-16 md:py-24 bg-brand-cloud">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                COMMON QUESTIONS
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight text-balance"
                style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
              >
                Everything you need to know
              </h2>
            </div>
            <Accordion items={FAQ_ITEMS} />
          </div>
        </Container>
      </section>

      {/* ── 4. CTA ── */}
      <CTABanner />
    </>
  )
}
