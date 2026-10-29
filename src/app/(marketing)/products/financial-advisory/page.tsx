import type { Metadata } from 'next'
import {
  TrendingUp,
  ClipboardList,
  BarChart3,
  FileText,
  Scale,
  Receipt,
  MessageSquare,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { ProductLayout } from '@/components/layout/ProductLayout'

export const metadata: Metadata = {
  alternates: { canonical: '/products/financial-advisory' },
  title: 'Financial Advisory | FAIS Licensed',
  description:
    'FSCA-licensed financial advisory services in South Africa. Honest, transparent advice on insurance and financial planning. No hidden commissions.',
}

const SERVICES = [
  {
    icon: ClipboardList,
    title: 'Risk Assessment',
    description:
      'We assess your current financial exposure and recommend appropriate cover levels.',
  },
  {
    icon: BarChart3,
    title: 'Financial Planning',
    description:
      'Short and long-term financial planning aligned to your income, goals, and obligations.',
  },
  {
    icon: FileText,
    title: 'Policy Review',
    description:
      'We review your existing policies to identify gaps, overlaps, and overcharging.',
  },
]

const FAIS_CREDENTIALS = [
  {
    icon: Scale,
    title: 'Legal Obligation to Act in Your Interest',
    body: 'FAIS-licensed advisors are legally required to put your interests first — not the interests of the product provider. Recommending a product simply because it pays higher commission is a FAIS violation.',
  },
  {
    icon: Receipt,
    title: 'Mandatory Fee Disclosure',
    body: 'Before rendering any service, your advisor must disclose all fees, commissions, and financial interests in writing. You should never be surprised by what your advice cost you.',
  },
  {
    icon: FileText,
    title: 'Record of Advice',
    body: 'Every recommendation InsurIQ makes is documented in a formal Record of Advice (ROA). This record protects you — it captures what was discussed, what was recommended, and why.',
  },
  {
    icon: MessageSquare,
    title: 'Regulated Complaints Process',
    body: 'If you are dissatisfied with advice received, you have a formal complaints process available — first through InsurIQ, then through the FSCA-appointed FAIS Ombud.',
  },
]

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'What is the difference between an advisor and a broker?',
    answer:
      'A broker acts as an intermediary between you and a product provider, earning commission on products placed. An advisor is licensed under FAIS to give financial advice and is legally bound to act in your best interest. InsurIQ advisors are FAIS-licensed and must disclose all remuneration before advising you.',
  },
  {
    question: 'Do you earn commission on products you recommend?',
    answer:
      'In line with FAIS requirements, we disclose all remuneration upfront. Where InsurIQ earns commission or fees from a product provider, this is disclosed in your Record of Advice before any recommendation is acted on. You have the right to accept or reject any recommendation.',
  },
  {
    question: 'What is a Record of Advice?',
    answer:
      'A Record of Advice (ROA) is a formal document required under FAIS. It records the details of your financial situation, the advice given, the products recommended, the reasons for the recommendations, and any risks or alternatives considered. You are entitled to a copy of your ROA after every advisory interaction.',
  },
  {
    question: 'How do I lodge a complaint about advice I received?',
    answer:
      'You may submit a formal complaint to InsurIQ\'s complaints email. If unresolved within the required timeframe, you may escalate to the FAIS Ombud (www.faisombud.co.za) at no cost to you. Full details are on our Complaints Procedure page.',
  },
]

export default function FinancialAdvisoryPage() {
  return (
    <ProductLayout
      hero={{
        eyebrow: 'FINANCIAL ADVISORY',
        title: 'Advice you can',
        gradientWord: 'trust.',
        subtitle:
          'FSCA-licensed financial advice tailored to your situation. No commissions hidden in recommendations. No jargon. Just honest guidance.',
        icon: TrendingUp,
        badge: 'FAIS Licensed',
        stat: {
          value: 'FAIS',
          label: 'licensed advice — legally required to act in your best interest',
        },
        cta: { label: 'Get a Free Quote', href: '/contact' },
      }}
    >

      {/* ── SECTION 1 — WHAT IS IT? ── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                WHAT WE DO
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight mb-5"
                style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
              >
                Financial advice that works for you.
              </h2>
              <div className="space-y-4 text-[15px] text-brand-body font-body leading-relaxed">
                <p>
                  InsurIQ is licensed under the Financial Advisory and Intermediary Services Act
                  (FAIS) to provide financial advice. That licence is not just a credential — it is
                  a legal commitment to act in your interest, disclose our fees, and document every
                  recommendation we make.
                </p>
                <p>
                  Unlike a product salesperson who earns more by selling you a specific policy, a
                  FAIS-licensed advisor is legally obligated to recommend what is right for your
                  situation. If our recommendation is not in your best interest, we are in breach of
                  the law.
                </p>
              </div>
            </div>

            {/* Right — service cards */}
            <div className="space-y-4">
              {SERVICES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex items-start gap-4 bg-brand-cloud rounded-xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5 text-brand-cyan" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-brand-navy text-base mb-1">{title}</h3>
                    <p className="text-[14px] text-brand-muted font-body leading-relaxed">{description}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── SECTION 2 — FAIS DIFFERENCE ── */}
      <section className="py-16 md:py-24 bg-brand-cloud">
        <Container>
          <div className="text-center mb-12">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              WHY FAIS MATTERS
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance max-w-2xl mx-auto"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
            >
              Licensed to put you first.
            </h2>
            <p className="text-[15px] text-brand-muted font-body mt-4 max-w-xl mx-auto leading-relaxed">
              FAIS authorisation is not just a registration. It imposes concrete obligations on
              every advisor — obligations that protect you at every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {FAIS_CREDENTIALS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex items-start gap-5 bg-white rounded-2xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-navy/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-brand-navy" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-brand-navy text-base mb-2">{title}</h3>
                  <p className="text-[14px] text-brand-body font-body leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3 — FAQ ── */}
      <section className="py-16 md:py-24 bg-white">
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
