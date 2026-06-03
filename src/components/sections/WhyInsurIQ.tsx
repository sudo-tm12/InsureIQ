'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { Zap, Eye, BadgeCheck, TrendingDown, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'

interface WhyPoint {
  icon: LucideIcon
  title: string
  body: string
}

const POINTS: WhyPoint[] = [
  {
    icon: Zap,
    title: 'Up to 40% Cheaper',
    body: 'We compare credit life rates across providers so you never overpay.',
  },
  {
    icon: Eye,
    title: 'Fully Transparent',
    body: 'Every cost, every term, explained in plain language. No surprises.',
  },
  {
    icon: BadgeCheck,
    title: 'FSCA Licensed',
    body: 'Regulated, accountable, and compliant. Your protection is our legal obligation.',
  },
]

const EYEBROW = 'WHY US'
const HEADING = 'Built differently, by design'
const SUBHEADING =
  "InsurIQ was built to fix what's broken in credit life insurance. Here's what that looks like in practice."

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

export function WhyInsurIQ() {
  const prefersReduced = useReducedMotion()

  const motionProps = prefersReduced
    ? { initial: 'visible', whileInView: 'visible' }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
      }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* ── Left: heading + stat box ── */}
          <motion.div
            initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
            whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: 'easeOut' as const }}
          >
            <p className="text-label font-medium uppercase tracking-widest text-brand-cyan mb-3 font-body">
              {EYEBROW}
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance mb-4"
              style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1 }}
            >
              {HEADING}
            </h2>
            <p className="text-[15px] text-brand-muted font-body leading-relaxed mb-8 lg:mb-10">
              {SUBHEADING}
            </p>

            {/* Stat box — mobile: compact flex row | desktop: stacked */}
            <div className="bg-brand-navy rounded-2xl p-6 lg:p-8 text-white">
              {/* Mobile layout: number left, icon right */}
              <div className="flex items-center justify-between lg:block">
                <div>
                  <p className="text-label font-medium uppercase tracking-widest text-brand-cyan mb-1 lg:mb-2 font-body">
                    Starting from
                  </p>
                  <div className="flex items-baseline gap-1 lg:mb-3">
                    <span
                      className="font-display font-bold text-white leading-none text-5xl lg:text-[64px]"
                    >
                      R89
                    </span>
                    <span className="text-white/40 font-body text-sm lg:text-xl">/month</span>
                  </div>
                  <p className="text-white/60 font-body text-xs mt-1 lg:hidden">
                    average saving
                  </p>
                </div>
                {/* TrendingDown icon — mobile only */}
                <TrendingDown
                  className="w-10 h-10 text-brand-cyan flex-shrink-0 lg:hidden"
                  aria-hidden="true"
                />
              </div>
              {/* Desktop description */}
              <p className="hidden lg:block text-sm text-white/60 font-body leading-relaxed">
                Credit life cover for a R50,000 personal loan. Your premium
                decreases as you pay off your debt — unlike your bank&apos;s fixed
                rate.
              </p>
            </div>
          </motion.div>

          {/* ── Right: benefits list ── */}
          <motion.div
            className="divide-y divide-brand-border"
            variants={containerVariants}
            {...motionProps}
          >
            {POINTS.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                className="flex items-start gap-4 lg:gap-5 py-5 lg:py-8 first:pt-0 last:pb-0"
              >
                {/* Icon container */}
                <div className="w-10 h-10 rounded-xl bg-brand-navy/[0.06] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-brand-navy" aria-hidden="true" />
                </div>

                <div>
                  <h3 className="font-display font-bold text-[17px] lg:text-h4 text-brand-navy mb-1 lg:mb-2">
                    {title}
                  </h3>
                  <p className="text-[14px] lg:text-body text-brand-body font-body leading-relaxed">
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
