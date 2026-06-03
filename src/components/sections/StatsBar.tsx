'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Stat {
  prefix?: string
  value: string
  suffix?: string
  label: string
  allCyan?: boolean
}

const STATS: Stat[] = [
  { prefix: 'R ', value: '2.4B+', label: 'Claims Backed' },
  { value: '40', suffix: '%', label: 'Average Saving' },
  { prefix: '< ', value: '5 min', label: 'Application Time' },
  { value: 'FSCA', label: 'Licensed', allCyan: true },
]

const CELL_BG = ['bg-white', 'bg-brand-cloud', 'bg-brand-cloud', 'bg-white']

export function StatsBar() {
  const prefersReduced = useReducedMotion()

  return (
    <section className="border-b border-brand-border overflow-hidden">
      {/* Full-bleed grid — negative margin cancels Container padding on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
        {STATS.map(({ prefix, value, suffix, label, allCyan }, i) => (
          <motion.div
            key={label}
            className={cn(
              'text-center py-8 px-6',
              // Mobile checkerboard backgrounds (removed on lg)
              CELL_BG[i],
              'lg:bg-white',
              // Desktop vertical dividers only
              i < STATS.length - 1 && 'lg:border-r lg:border-brand-border',
            )}
            initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              ease: 'easeOut' as const,
              delay: i * 0.08,
            }}
          >
            {/* Value with coloured prefix/suffix */}
            <div className="flex items-baseline justify-center gap-0.5 mb-2">
              {prefix && (
                <span className="font-display font-bold text-brand-cyan text-xl leading-none">
                  {prefix}
                </span>
              )}
              <span
                className={cn(
                  'font-display font-bold leading-none text-[40px] lg:text-5xl',
                  allCyan ? 'text-brand-cyan' : 'text-brand-navy',
                )}
              >
                {value}
              </span>
              {suffix && (
                <span className="font-display font-bold text-brand-cyan text-xl leading-none">
                  {suffix}
                </span>
              )}
            </div>

            {/* Label */}
            <p className="text-[11px] font-body font-medium uppercase tracking-wider text-brand-muted mt-2">
              {label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
