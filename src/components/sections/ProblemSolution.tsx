'use client'

import { useState } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { XCircle, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/utils'

interface ComparisonRow {
  oldWay: string
  newWay: string
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    oldWay: 'Hidden fees buried in your repayments',
    newWay: 'Transparent pricing — every cent explained',
  },
  {
    oldWay: 'Paper forms and weeks of waiting',
    newWay: 'Digital application complete in minutes',
  },
  {
    oldWay: 'Generic cover with no explanation',
    newWay: 'Intelligent matching to your exact debt',
  },
  {
    oldWay: 'Call centres, hold music, no answers',
    newWay: 'Self-service, 24/7, on any device',
  },
]

const EYEBROW = 'THE DIFFERENCE'

type Tab = 'before' | 'after'

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
}

function OldWayCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-5 border-l-4 border-red-300">
      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span className="text-body text-brand-muted font-body leading-snug line-through decoration-brand-muted/40">
        {text}
      </span>
    </div>
  )
}

function NewWayCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-xl p-5 border-l-4 border-brand-cyan shadow-card">
      <CheckCircle2 className="w-5 h-5 text-brand-cyan flex-shrink-0 mt-0.5" aria-hidden="true" />
      <span className="text-body text-brand-navy font-semibold font-body leading-snug">
        {text}
      </span>
    </div>
  )
}

export function ProblemSolution() {
  const prefersReduced = useReducedMotion()
  const [activeTab, setActiveTab] = useState<Tab>('before')

  const motionProps = prefersReduced
    ? { initial: 'visible', whileInView: 'visible' }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
      }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-brand-cloud">
      <Container>
        {/* Section header */}
        <motion.div
          className="text-center mb-10 md:mb-14"
          initial={prefersReduced ? {} : { opacity: 0, y: 24 }}
          whileInView={prefersReduced ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' as const }}
        >
          <p className="text-label font-medium uppercase tracking-widest text-brand-cyan mb-4 font-body">
            {EYEBROW}
          </p>
          <h2
            className="font-display font-bold tracking-tight text-balance mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.1 }}
          >
            <span className="text-brand-navy">Your bank is </span>
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, #1A5FBF 0%, #5DCDE6 100%)',
              }}
            >
              overcharging you.
            </span>
          </h2>
          <p className="text-body-lg text-brand-muted max-w-2xl mx-auto font-body leading-relaxed">
            Traditional credit life insurance leaves you in the dark. We built
            something better.
          </p>
        </motion.div>

        {/* ── Mobile: tab interface ── */}
        <div className="lg:hidden">
          {/* Tab bar */}
          <div className="flex w-full bg-brand-border/50 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('before')}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium font-body transition-all duration-200',
                activeTab === 'before'
                  ? 'bg-white text-red-500 shadow-sm'
                  : 'text-brand-muted',
              )}
            >
              Before InsurIQ
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-medium font-body transition-all duration-200',
                activeTab === 'after'
                  ? 'bg-brand-navy text-white shadow-sm'
                  : 'text-brand-muted',
              )}
            >
              With InsurIQ
            </button>
          </div>

          {/* Panel */}
          <motion.div
            key={activeTab}
            initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' as const }}
            className="space-y-3"
          >
            {COMPARISON_ROWS.map((row) =>
              activeTab === 'before' ? (
                <OldWayCard key={row.oldWay} text={row.oldWay} />
              ) : (
                <NewWayCard key={row.newWay} text={row.newWay} />
              ),
            )}
          </motion.div>
        </div>

        {/* ── Desktop: 3 columns (before | divider | after) ── */}
        <div className="hidden lg:grid lg:grid-cols-[1fr_56px_1fr] gap-0 items-start">
          {/* Before */}
          <motion.div
            className="space-y-4 pr-8"
            variants={containerVariants}
            {...motionProps}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-muted/70 font-body mb-6 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full bg-red-300 flex-shrink-0"
                aria-hidden="true"
              />
              The Old Way
            </h3>
            {COMPARISON_ROWS.map(({ oldWay }) => (
              <motion.div key={oldWay} variants={itemVariants}>
                <OldWayCard text={oldWay} />
              </motion.div>
            ))}
          </motion.div>

          {/* Gradient vertical divider */}
          <div className="flex justify-center pt-10 pb-4" aria-hidden="true">
            <div
              className="w-px h-full"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, #5DCDE6 30%, #5DCDE6 70%, transparent 100%)',
              }}
            />
          </div>

          {/* After */}
          <motion.div
            className="space-y-4 pl-8"
            variants={containerVariants}
            {...motionProps}
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-brand-navy font-body mb-6 flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full bg-brand-cyan flex-shrink-0"
                aria-hidden="true"
              />
              The InsurIQ Way
            </h3>
            {COMPARISON_ROWS.map(({ newWay }) => (
              <motion.div key={newWay} variants={itemVariants}>
                <NewWayCard text={newWay} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Container>
    </section>
  )
}
