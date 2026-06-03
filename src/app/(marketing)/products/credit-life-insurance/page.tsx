import type { Metadata } from 'next'
import {
  ShieldCheck,
  UserX,
  Accessibility,
  Briefcase,
  TrendingDown,
  Car,
  Home,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { ProductLayout } from '@/components/layout/ProductLayout'

export const metadata: Metadata = {
  title: 'Credit Life Insurance | InsurIQ — From R89/month',
  description:
    'Affordable credit life insurance for South Africans. Covers vehicle finance, home loans, and personal loans. FSCA licensed. Up to 40% cheaper than your bank.',
}

const BENEFIT_CARDS = [
  {
    icon: UserX,
    title: 'Death Cover',
    description: 'Your outstanding balance is settled in full on death.',
  },
  {
    icon: Accessibility,
    title: 'Permanent Disability',
    description: 'Cover if you become permanently unable to work.',
  },
  {
    icon: Briefcase,
    title: 'Retrenchment',
    description: 'Monthly repayments covered for up to 12 months.',
  },
  {
    icon: TrendingDown,
    title: 'Reducing Premium',
    description: 'Your premium reduces as your loan balance decreases.',
  },
]

const LOAN_TYPES = [
  {
    icon: Car,
    title: 'Vehicle Finance',
    description:
      'Protecting your car loan means your family keeps the vehicle — or it is settled — if you can no longer repay.',
  },
  {
    icon: Home,
    title: 'Home Loans',
    description:
      'Your home is likely your biggest asset. Credit life ensures your family is not forced to sell it.',
  },
  {
    icon: CreditCard,
    title: 'Personal Loans',
    description:
      'Personal and store credit accounts are covered — often the most overlooked debt.',
  },
]

const TABLE_ROWS = [
  { feature: 'Monthly cost', bank: 'Hidden in repayment', insuriq: 'Clearly stated' },
  { feature: 'Pricing disclosed', bank: 'Rarely', insuriq: 'Always' },
  { feature: 'Cancel anytime', bank: 'Varies', insuriq: 'Yes' },
  { feature: 'Application', bank: 'At branch', insuriq: 'Online' },
  { feature: 'Time to cover', bank: 'Days', insuriq: 'Minutes' },
  { feature: 'Premium reduces', bank: 'Rarely', insuriq: 'Yes' },
]

const INSURIQ_POSITIVE = new Set(['Always', 'Yes', 'Online', 'Minutes', 'Clearly stated'])
const BANK_NEGATIVE = new Set(['Hidden in repayment', 'Rarely', 'At branch', 'Days', 'Varies'])

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'Can I replace my bank\'s credit life with InsurIQ?',
    answer:
      'Yes. Under FAIS regulations you have the right to choose your own credit life insurance provider. Your bank cannot force you to use their bundled product. InsurIQ can replace your existing cover — typically at a significantly lower premium.',
  },
  {
    question: 'What is not covered?',
    answer:
      'Standard exclusions include: pre-existing medical conditions declared at application, self-inflicted injury, retrenchment caused by resignation, and events occurring within the waiting period. Full exclusions are listed in your policy schedule.',
  },
  {
    question: 'How quickly does a claim pay out?',
    answer:
      'Claims are assessed within 10 business days of receiving all required documentation. Payment is made directly to the credit provider to settle the outstanding balance.',
  },
  {
    question: 'What documents do I need to apply?',
    answer:
      'SA ID number, loan account number and outstanding balance, bank account details for debit order, and a valid email and phone number.',
  },
]

export default function CreditLifeInsurancePage() {
  return (
    <ProductLayout
      hero={{
        eyebrow: 'CREDIT LIFE INSURANCE',
        title: 'Cover that',
        gradientWord: 'protects.',
        subtitle:
          'If you die, become permanently disabled, or are retrenched — InsurIQ pays off your outstanding loan. Your family inherits your assets, not your debt.',
        icon: ShieldCheck,
        badge: 'Most Popular',
        stat: {
          value: '40%',
          label: 'cheaper than bundled bank rates on average',
        },
      }}
    >

      {/* ── SECTION 1 — WHAT IS IT? ── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Left */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                WHAT IS CREDIT LIFE INSURANCE?
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight mb-5"
                style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
              >
                Your debt, covered.
              </h2>
              <div className="space-y-4 text-[15px] text-brand-body font-body leading-relaxed">
                <p>
                  Credit life insurance is a policy that settles your outstanding loan balance — or
                  covers your monthly repayments — when life does not go to plan. Whether you pass
                  away, become permanently disabled, or are retrenched, your loan is taken care of.
                </p>
                <p>
                  Most South Africans already have credit life insurance — it is bundled into your
                  loan repayment by your bank. The problem is the bank rarely tells you what you are
                  paying, what you are covered for, or that you have the right to choose your own
                  provider.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 bg-brand-cyan/8 rounded-2xl px-5 py-4">
                <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0" aria-hidden="true" />
                <p className="text-sm font-body text-brand-navy font-medium">
                  Under the NCA you have the legal right to choose your own provider.
                </p>
              </div>
            </div>

            {/* Right — benefit cards */}
            <div className="grid grid-cols-2 gap-4">
              {BENEFIT_CARDS.map(({ icon: Icon, title, description }) => (
                <div key={title} className="bg-brand-cloud rounded-xl p-5">
                  <Icon className="w-8 h-8 text-brand-cyan mb-3" aria-hidden="true" />
                  <h3 className="font-display font-bold text-brand-navy text-base mb-1.5">{title}</h3>
                  <p className="text-[13px] text-brand-muted font-body leading-snug">{description}</p>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── SECTION 2 — WHO NEEDS IT? ── */}
      <section className="py-16 md:py-24 bg-brand-cloud">
        <Container>
          <div className="text-center mb-12">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              WHO IS THIS FOR?
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
            >
              If you have a loan, you need this.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOAN_TYPES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-brand-cyan/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-brand-cyan" aria-hidden="true" />
                </div>
                <h3 className="font-display font-bold text-brand-navy text-lg mb-2">{title}</h3>
                <p className="text-[14px] text-brand-muted font-body leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3 — COMPARISON ── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="text-center mb-12">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              TRANSPARENT PRICING
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
            >
              What you pay. What you get.
            </h2>
          </div>

          {/* Mobile: cards */}
          <div className="lg:hidden max-w-lg mx-auto space-y-3 mb-8">
            {TABLE_ROWS.map(({ feature, bank, insuriq }) => (
              <div key={feature} className="bg-brand-cloud rounded-2xl p-5">
                <p className="text-xs font-body font-medium uppercase tracking-wider text-brand-muted mb-3">
                  {feature}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-brand-muted font-body mb-1">Your Bank</p>
                    <p className={`text-sm font-body font-medium ${BANK_NEGATIVE.has(bank) ? 'text-red-500' : 'text-brand-body'}`}>
                      {bank}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-brand-cyan font-body font-medium mb-1">InsurIQ</p>
                    <p className={`text-sm font-body font-bold ${INSURIQ_POSITIVE.has(insuriq) ? 'text-brand-cyan' : 'text-brand-navy'}`}>
                      {insuriq}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden lg:block max-w-3xl mx-auto mb-8">
            <table className="w-full bg-white rounded-2xl overflow-hidden shadow-card text-left border border-brand-border">
              <thead>
                <tr className="border-b border-brand-border">
                  <th className="px-6 py-4 font-body font-semibold text-brand-navy text-sm">Feature</th>
                  <th className="px-6 py-4 font-body font-semibold text-brand-muted text-sm text-center">Your Bank</th>
                  <th className="px-6 py-4 font-body font-bold text-brand-cyan text-sm text-center bg-brand-navy/[0.03] border-t-2 border-t-brand-cyan">InsurIQ</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map(({ feature, bank, insuriq }, i) => (
                  <tr key={feature} className={i % 2 === 0 ? 'bg-white' : 'bg-brand-cloud/40'}>
                    <td className="px-6 py-4 font-body text-[15px] text-brand-body">{feature}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`text-sm font-body ${BANK_NEGATIVE.has(bank) ? 'text-red-400' : 'text-brand-body'}`}>
                        {bank}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center bg-brand-navy/[0.02]">
                      <span className={`text-sm font-body font-semibold ${INSURIQ_POSITIVE.has(insuriq) ? 'text-brand-cyan' : 'text-brand-navy'}`}>
                        {insuriq}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing note */}
          {/* TODO: Replace with real InsurIQ rate table when confirmed by Eddie */}
          <div className="bg-brand-cloud rounded-2xl p-6 max-w-2xl mx-auto text-center">
            <p className="text-brand-navy font-body font-semibold text-[15px]">
              Indicative premiums start from R89/month for a R100,000 loan.
            </p>
            <p className="text-brand-muted text-sm font-body mt-1.5">
              Final premium depends on loan type, outstanding balance, remaining term, and your personal profile.
            </p>
          </div>
        </Container>
      </section>

      {/* ── SECTION 4 — FAQ ── */}
      <section className="py-16 md:py-24 bg-brand-cloud">
        <Container className="max-w-3xl">
          <div className="text-center mb-10">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              COMMON QUESTIONS
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
            >
              Your questions, answered.
            </h2>
          </div>
          <Accordion items={FAQ_ITEMS} />
        </Container>
      </section>

    </ProductLayout>
  )
}
