import type { Metadata } from 'next'
import {
  BarChart3,
  Shield,
  Handshake,
  ClipboardList,
  FileText,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Accordion, type AccordionItem } from '@/components/ui/Accordion'
import { ProductLayout } from '@/components/layout/ProductLayout'

export const metadata: Metadata = {
  title: 'Debt Management | InsurIQ — Debt Review South Africa',
  description:
    'NCR-registered debt review and debt mediation services in South Africa. Legal protection, reduced repayments, one monthly payment. Free assessment.',
}

const SERVICES = [
  {
    icon: Shield,
    title: 'Debt Review',
    subtitle: 'Formal, NCA-regulated process',
    description:
      'A formal, legally-regulated process under the National Credit Act. Your assets are protected while we negotiate reduced repayments with your creditors.',
    forWho: 'People who are over-indebted and cannot meet current obligations.',
  },
  {
    icon: Handshake,
    title: 'Debt Mediation',
    subtitle: 'Faster, informal negotiation',
    description:
      'An informal negotiation process for clients who are not yet over-indebted but are struggling. Faster than formal debt review with no credit record flag.',
    forWho: 'People struggling but not yet in default.',
  },
]

const PROCESS_STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Assessment',
    description:
      'We assess your full financial picture — income, expenses, and all debt obligations.',
    meta: 'Free, 30-minute consultation',
  },
  {
    number: '02',
    icon: FileText,
    title: 'Application',
    description:
      'We apply for debt review or mediation on your behalf and notify all credit providers.',
    meta: 'Same day',
  },
  {
    number: '03',
    icon: ShieldCheck,
    title: 'Legal Protection',
    description:
      'Once applied, you are legally protected from repossession and legal action by creditors.',
    meta: 'Immediate on application',
  },
  {
    number: '04',
    icon: CreditCard,
    title: 'Restructured Payments',
    description:
      'One reduced monthly payment to a Payment Distribution Agency. No direct creditor contact.',
    meta: 'Within 30 days',
  },
  {
    number: '05',
    icon: CheckCircle2,
    title: 'Clearance Certificate',
    description:
      'Once all debt is settled, you receive a clearance certificate and your credit record is restored.',
    meta: 'On completion',
  },
]

const FAQ_ITEMS: AccordionItem[] = [
  {
    question: 'Will debt review affect my credit record?',
    answer:
      'Yes — honestly, it will. A debt review flag is placed on your credit record for the duration of the process. This means you cannot apply for new credit while under debt review. However, once all debts are settled and a clearance certificate is issued, the flag is removed and your credit record is restored. For most clients, the protection and breathing room outweigh this temporary restriction.',
  },
  {
    question: 'Can I still use my credit cards during debt review?',
    answer:
      'No. Once formally under debt review, you cannot take on new credit or use existing credit facilities. This includes credit cards, store accounts, and personal loans. This restriction is part of the NCA process and is designed to prevent further over-indebtedness while your debt is being restructured.',
  },
  {
    question: 'How long does debt review take?',
    answer:
      'The duration depends on the total amount of debt and your restructured monthly payment. Most clients complete debt review in 3 to 5 years. The process formally ends when all debts included in the review are fully settled and a clearance certificate is issued by your debt counsellor.',
  },
  {
    question: 'What happens if I miss a payment during debt review?',
    answer:
      'Missing payments during debt review is serious. If you default on your restructured payment plan, creditors may apply to terminate the debt review process, after which they can resume legal action. It is critical to maintain your restructured payments consistently. If your financial situation changes, contact InsurIQ immediately — we can apply to have the payment plan adjusted.',
  },
]

export default function DebtManagementPage() {
  return (
    <ProductLayout
      hero={{
        eyebrow: 'DEBT MANAGEMENT',
        title: 'Your path to',
        gradientWord: 'financial freedom.',
        subtitle:
          'Structured debt review and mediation services that protect you legally, reduce your monthly obligations, and create a clear path out of over-indebtedness.',
        icon: BarChart3,
        badge: 'NCR Registered',
        stat: {
          value: '1 in 4',
          label: 'South African adults are over-indebted. You are not alone.',
        },
      }}
    >

      {/* ── SECTION 1 — WHAT IS IT? ── */}
      <section className="py-16 md:py-24 bg-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left */}
            <div>
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                TWO PATHS TO RELIEF
              </p>
              <h2
                className="font-display font-bold text-brand-navy tracking-tight mb-5"
                style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
              >
                Take control of your debt.
              </h2>
              <div className="space-y-4 text-[15px] text-brand-body font-body leading-relaxed">
                <p>
                  If your monthly debt repayments are unmanageable, South African law gives you
                  formal options. Debt review is a legally-regulated process under the National
                  Credit Act (NCA) that provides immediate protection from creditors while your
                  debt is restructured.
                </p>
                <p>
                  Debt mediation is an alternative for clients who are struggling but not yet
                  formally over-indebted. It is an informal negotiation that can achieve lower
                  repayments faster, without the formal consequences of debt review on your
                  credit record.
                </p>
              </div>
            </div>

            {/* Right — service cards */}
            <div className="space-y-5">
              {SERVICES.map(({ icon: Icon, title, subtitle, description, forWho }) => (
                <div key={title} className="bg-brand-cloud rounded-2xl p-6">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-navy/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-brand-navy" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-brand-navy text-base">{title}</h3>
                      <p className="text-[11px] font-body text-brand-muted uppercase tracking-wider mt-0.5">{subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-brand-body font-body leading-relaxed mb-3">{description}</p>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[13px] text-brand-muted font-body italic">{forWho}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </Container>
      </section>

      {/* ── SECTION 2 — THE PROCESS ── */}
      <section
        className="py-16 md:py-24 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <Container>
          <div className="text-center mb-12">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              HOW IT WORKS
            </p>
            <h2
              className="font-display font-bold text-white tracking-tight text-balance"
              style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', lineHeight: 1.1 }}
            >
              The debt review process, step by step.
            </h2>
          </div>

          {/* Timeline */}
          <div className="max-w-2xl mx-auto">
            {PROCESS_STEPS.map(({ number, icon: Icon, title, description, meta }, i) => (
              <div key={number} className="flex gap-6 mb-8 last:mb-0">
                {/* Left: number + line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-14 h-14 rounded-full bg-brand-cyan flex items-center justify-center font-display font-bold text-brand-indigo text-lg flex-shrink-0"
                    style={{ boxShadow: '0 0 0 4px rgba(93,205,230,0.2), 0 0 0 8px rgba(93,205,230,0.08)' }}>
                    {number}
                  </div>
                  {i < PROCESS_STEPS.length - 1 && (
                    <div className="w-px flex-1 mt-3 min-h-[40px]" style={{ background: 'linear-gradient(to bottom, rgba(93,205,230,0.4), rgba(93,205,230,0.1))' }} aria-hidden="true" />
                  )}
                </div>

                {/* Right: content */}
                <div className="pt-2 pb-8 last:pb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-brand-cyan" aria-hidden="true" />
                    <h3 className="font-display font-bold text-white text-lg">{title}</h3>
                  </div>
                  <p className="text-[15px] text-white/65 font-body leading-relaxed mb-2">{description}</p>
                  <span className="inline-flex items-center bg-white/10 border border-white/15 rounded-full px-3 py-1 text-[11px] font-body text-white/50 uppercase tracking-wider">
                    {meta}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── SECTION 3 — IMPORTANT NOTICE ── */}
      <section className="py-12 md:py-16 bg-white">
        <Container>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 md:p-8 max-w-3xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-display font-bold text-amber-900 text-base mb-2">
                  Important: Debt review is a serious financial decision.
                </h3>
                <p className="text-amber-800 text-sm font-body leading-relaxed">
                  Debt review affects your credit record for the duration of the process and prevents
                  you from taking on new credit. InsurIQ will provide a full assessment and
                  explanation before any application is submitted. We will never recommend debt review
                  unless it is the right option for your situation.
                </p>
              </div>
            </div>
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
