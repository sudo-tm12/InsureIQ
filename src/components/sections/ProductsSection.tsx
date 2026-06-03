'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { ShieldCheck, TrendingUp, BarChart3 } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/ui/ProductCard'
import { cn } from '@/lib/utils'

const EYEBROW = 'WHAT WE OFFER'
const HEADING = 'Solutions built for your situation'
const SUBHEADING =
  'Three ways InsurIQ protects your financial future — transparently, affordably, intelligently.'

const PRODUCTS = [
  {
    icon: ShieldCheck,
    title: 'Credit Life Insurance',
    description:
      "Covers your outstanding debt if you're unable to repay due to death, disability, or retrenchment.",
    features: [
      'Vehicle finance cover',
      'Home loan protection',
      'Personal loan cover',
      'Retrenchment benefit',
      'Up to 40% cheaper than bundled bank rates',
    ],
    href: '/products/credit-life-insurance',
    featured: true,
  },
  {
    icon: TrendingUp,
    title: 'Financial Advisory',
    description:
      'FSCA-licensed advice tailored to your financial situation and goals.',
    features: [
      'Risk assessment',
      'Short-term insurance',
      'Financial planning',
      'FAIS-compliant advice',
      'Personalised recommendations',
    ],
    href: '/products/financial-advisory',
  },
  {
    icon: BarChart3,
    title: 'Debt Management',
    description:
      'Take control of your debt with structured review and professional mediation.',
    features: [
      'Debt review',
      'Debt mediation',
      'Restructured repayments',
      'Legal protection while under review',
      'Path to financial freedom',
    ],
    href: '/products/debt-management',
  },
]

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
}

export function ProductsSection() {
  const prefersReduced = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeCard, setActiveCard] = useState(0)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const handleScroll = () => {
      const cardWidth = 300 + 16 // featured card width + gap
      const index = Math.min(
        PRODUCTS.length - 1,
        Math.round(el.scrollLeft / cardWidth),
      )
      setActiveCard(index)
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  const motionProps = prefersReduced
    ? { initial: 'visible', whileInView: 'visible' }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '-80px' },
      }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-white overflow-hidden">
      <Container>
        {/* Section header */}
        <motion.div
          className="mb-10 md:mb-16"
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
          <p className="text-body-lg text-brand-muted max-w-2xl font-body leading-relaxed">
            {SUBHEADING}
          </p>
        </motion.div>
      </Container>

      {/* ── Mobile: horizontal scroll carousel ── */}
      <div className="lg:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth-ios px-5 pb-4"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {PRODUCTS.map((product, i) => (
            <div
              key={product.title}
              className="flex-shrink-0"
              style={{
                width: i === 0 ? '82vw' : '75vw',
                scrollSnapAlign: 'start',
              }}
            >
              <ProductCard
                {...product}
                featured={product.featured}
                className="h-full min-h-[320px]"
              />
            </div>
          ))}
          {/* Trailing spacer so last card doesn't hug edge */}
          <div className="flex-shrink-0 w-1" aria-hidden="true" />
        </div>

        {/* Scroll indicator dots */}
        <div className="flex justify-center gap-1.5 mt-5 px-5">
          {PRODUCTS.map((_, i) => (
            <div
              key={i}
              className={cn(
                'rounded-full transition-all duration-300',
                i === activeCard
                  ? 'bg-brand-navy w-4 h-1.5'
                  : 'bg-brand-border w-1.5 h-1.5',
              )}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>

      {/* ── Desktop: grid layout ── */}
      <Container className="hidden lg:block">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          {...motionProps}
        >
          {/* Featured: Credit Life — tall left card */}
          <motion.div className="md:row-span-2" variants={itemVariants}>
            <ProductCard
              {...PRODUCTS[0]}
              featured={PRODUCTS[0].featured}
              className="h-full"
            />
          </motion.div>

          {/* Standard cards stacked on right */}
          {PRODUCTS.slice(1).map((product) => (
            <motion.div key={product.title} variants={itemVariants}>
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
