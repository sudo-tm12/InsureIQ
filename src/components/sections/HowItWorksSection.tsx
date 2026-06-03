'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import {
  ClipboardList,
  CheckSquare,
  PenLine,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

interface Step {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

const STEPS: Step[] = [
  {
    number: '01',
    title: 'Get a Quote',
    description: 'Answer a few questions online. Takes under 60 seconds.',
    icon: ClipboardList,
  },
  {
    number: '02',
    title: 'Choose Your Cover',
    description: 'See your options clearly. Transparent pricing, no hidden fees.',
    icon: CheckSquare,
  },
  {
    number: '03',
    title: 'Sign Digitally',
    description: 'POPIA-compliant. Secure. No printer required.',
    icon: PenLine,
  },
  {
    number: '04',
    title: "You're Covered",
    description: 'Instant policy documents delivered to your inbox.',
    icon: ShieldCheck,
  },
]

const EYEBROW = 'THE PROCESS'
const HEADING = 'Four steps to better cover'
const SUBHEADING =
  'From first question to active policy — the entire process lives on your phone.'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export function HowItWorksSection() {
  const prefersReduced = useReducedMotion()

  const motionProps = prefersReduced
    ? { initial: 'visible', whileInView: 'visible' }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
      }

  return (
    <section className="py-20 md:py-24 lg:py-32 bg-brand-indigo">
      <Container>
        {/* Section header */}
        <motion.div
          className="mb-14 lg:mb-16"
          initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          <p className="text-label font-medium uppercase tracking-widest text-brand-cyan mb-3 font-body">
            {EYEBROW}
          </p>
          <h2
            className="font-display font-bold text-white tracking-tight text-balance mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1 }}
          >
            {HEADING}
          </h2>
          <p className="text-[15px] text-white/60 max-w-2xl font-body leading-relaxed">
            {SUBHEADING}
          </p>
        </motion.div>

        {/* ── Mobile: enhanced vertical timeline ── */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Continuous gradient timeline line — centred on 56px circles (left: 28px) */}
            <div
              className="absolute w-0.5 pointer-events-none"
              style={{
                left: '28px',
                top: '28px',
                bottom: '28px',
                background:
                  'linear-gradient(to bottom, #5DCDE6, #4BAEF0, #1A5FBF, transparent)',
              }}
              aria-hidden="true"
            />

            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className={cn(
                    'relative flex items-start gap-5',
                    i < STEPS.length - 1 && 'mb-10',
                  )}
                >
                  {/* Glowing circle with step number */}
                  <div
                    className="relative z-10 w-14 h-14 rounded-full bg-brand-cyan flex items-center justify-center flex-shrink-0"
                    style={{
                      boxShadow:
                        '0 0 0 4px rgba(93,205,230,0.2), 0 0 0 8px rgba(93,205,230,0.08)',
                    }}
                  >
                    <span className="text-brand-indigo font-display font-bold text-lg leading-none">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-3 relative">
                    <span className="text-brand-cyan text-[10px] font-body font-medium tracking-[0.2em] uppercase block mb-1">
                      STEP {step.number}
                    </span>
                    <h3 className="text-white text-[18px] font-display font-semibold leading-snug mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/55 text-[13px] font-body leading-relaxed">
                      {step.description}
                    </p>

                    {/* Decorative icon — right aligned, very subtle */}
                    <Icon
                      className="absolute top-0 right-0 w-8 h-8 text-white/10"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Desktop: horizontal layout ── */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Gradient horizontal connector line */}
            <div
              className="absolute top-[22px] left-[12.5%] right-[12.5%] h-0.5 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to right, #5DCDE6, #2D84D8, #4BAEF0)',
              }}
              aria-hidden="true"
            />

            <motion.div
              className="grid grid-cols-4 gap-8"
              variants={containerVariants}
              {...motionProps}
            >
              {STEPS.map((step) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.number}
                    variants={itemVariants}
                    className="relative flex flex-col items-center text-center"
                  >
                    {/* Icon circle */}
                    <div className="relative z-10 w-11 h-11 rounded-full bg-brand-indigo border-2 border-brand-cyan/50 flex items-center justify-center mb-6">
                      <Icon className="w-5 h-5 text-brand-cyan" aria-hidden="true" />
                    </div>

                    {/* Ghost numeral — decorative */}
                    <span
                      className="absolute top-6 font-display text-7xl font-bold text-white/5 leading-none select-none pointer-events-none"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>

                    <span className="text-xs font-medium text-brand-cyan font-body tracking-wider mb-2">
                      {step.number}
                    </span>
                    <h3 className="font-display font-bold text-h4 text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body text-white/60 font-body leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
