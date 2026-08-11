'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { CheckCircle2, ArrowRight, Zap, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { PhoneMockup } from '@/components/ui/PhoneMockup'
import { cn } from '@/lib/utils'

const TRUST_SIGNALS = [
  'FSCA Licensed',
  'Free Quote',
  'POPIA Compliant',
]

export function HeroSection() {
  const prefersReduced = useReducedMotion()

  const fadeUp = (delay = 0) =>
    prefersReduced
      ? {}
      : {
          // opacity stays 1 so content is visible at first paint (LCP = FCP).
          // Only the y-translate animates — a subtle slide with no fade-in flash.
          initial: { opacity: 1, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, ease: 'easeOut' as const, delay },
        }

  return (
    <section
      className="relative min-h-[100svh] flex flex-col overflow-hidden overflow-x-hidden"
      style={{
        background:
          'linear-gradient(145deg, #071840 0%, #0B2D78 55%, #0d3590 100%)',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Decorative glows — desktop only */}
      <div
        className="hidden md:block absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(93,205,230,0.10) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      <div
        className="hidden md:block absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(75,174,240,0.08) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
        aria-hidden="true"
      />

      {/* Main content — grows to fill section height */}
      <Container className="relative w-full max-w-full flex-1 flex flex-col pt-28 pb-10 lg:pt-20 lg:pb-10 lg:justify-center lg:max-w-6xl">
        <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center lg:flex-none">

          {/* ── Left column ── */}
          <div className="lg:col-span-6 flex-1 flex flex-col justify-between lg:justify-center">

            {/* Top: eyebrow + headline + subheading */}
            <div>
              {/* Eyebrow pill */}
              <motion.div
                {...fadeUp(0)}
                className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-7 lg:mb-8 lg:px-4 lg:py-2"
              >
                <span
                  className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-[#27AE60] animate-pulse"
                  aria-hidden="true"
                />
                <span className="text-[10px] lg:text-xs font-medium text-white/90 uppercase tracking-widest font-body">
                  FSCA Licensed · Now Accepting Clients
                </span>
              </motion.div>

              {/* H1 — plain element (not motion) so it's visible at FCP for optimal LCP */}
              <h1
                id="hero-heading"
                className="font-display font-extrabold leading-none whitespace-normal break-words hyphens-none w-full mb-4 lg:mb-6 text-[42px] md:text-[52px] lg:text-[56px] xl:text-[68px] 2xl:text-[80px]"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="text-white lg:block">Credit life insurance </span>
                <span className="text-white lg:block">that actually </span>
                <span
                  className="bg-clip-text text-transparent block"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 50%, #ffffff 100%)',
                  }}
                >
                  works for you.
                </span>
              </h1>

              {/* Subheading — shorter on mobile */}
              <motion.p
                {...fadeUp(0.16)}
                className="text-[15px] text-white/65 font-body leading-relaxed max-w-[280px] lg:max-w-lg mb-0 lg:mb-10"
              >
                <span className="lg:hidden">
                  Affordable, transparent credit life cover. No jargon. No hidden fees.
                </span>
                <span className="hidden lg:inline">
                  Affordable cover. Transparent pricing. Built for South Africans
                  who deserve better.
                </span>
              </motion.p>
            </div>

            {/* Bottom: CTAs + trust (mt-auto on mobile pushes to bottom) */}
            <div className="mt-8 lg:mt-0">
              {/* CTAs */}
              <motion.div
                {...fadeUp(0.22)}
                className="flex flex-col gap-3 lg:flex-row lg:gap-4 mb-6"
              >
                <Button
                  size="lg"
                  className={cn(
                    'bg-white text-brand-navy font-bold rounded-2xl',
                    'hover:bg-brand-cyan hover:text-white hover:shadow-none',
                    'h-[52px] text-[15px] lg:h-auto lg:text-base lg:rounded-lg',
                    'inline-flex items-center gap-2',
                  )}
                  asChild
                >
                  <Link href="/get-quote">
                    Get My Free Quote
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  className={cn(
                    'font-semibold rounded-2xl h-[52px] text-[15px]',
                    'bg-white/8 text-white border border-white/15',
                    'hover:bg-white/15 hover:text-white hover:shadow-none',
                    'lg:bg-transparent lg:border-white/30 lg:rounded-lg lg:h-auto lg:text-base',
                  )}
                  asChild
                >
                  <Link href="/how-it-works">See How It Works</Link>
                </Button>
              </motion.div>

              {/* Trust signals */}
              <motion.div
                {...fadeUp(0.28)}
                className="flex flex-wrap gap-x-4 gap-y-2 justify-center lg:justify-start"
              >
                {TRUST_SIGNALS.map((signal) => (
                  <div key={signal} className="flex items-center gap-1.5">
                    <CheckCircle2
                      className="w-3 h-3 text-brand-cyan/70 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-[11px] text-white/45 font-body">
                      {signal}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Right column: phone mockup — desktop only ── */}
          <div className="hidden lg:flex lg:col-span-6 justify-end">
            <motion.div {...fadeUp(0.2)} className="relative">
              {/* Badge: speed — top right */}
              <div
                className="hidden lg:flex absolute -top-5 -right-6 z-20 items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-xl"
                aria-hidden="true"
              >
                <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-xs font-body font-bold text-brand-navy leading-none">
                    Under 5 minutes
                  </div>
                  <div className="text-[10px] text-brand-muted font-body mt-0.5">
                    From question to quote
                  </div>
                </div>
              </div>

              <PhoneMockup className="drop-shadow-2xl" />

              {/* Badge: trust — bottom left */}
              <div
                className="hidden lg:flex absolute -bottom-5 -left-6 z-20 items-center gap-2 bg-brand-navy rounded-2xl px-4 py-2.5 shadow-xl"
                aria-hidden="true"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <div className="text-xs font-body font-bold text-white leading-none">
                    FSCA Licensed
                  </div>
                  <div className="text-[10px] text-white/55 font-body mt-0.5">
                    Regulated & compliant
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </Container>

      {/* Bottom fade — softens transition into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Sentinel — IntersectionObserver target for Navbar.
          Spans the hero minus the navbar band (h-16 / lg:h-20), so the navbar
          flips to its light treatment exactly as the hero's bottom edge passes
          under it. Must not be a strip at the hero's bottom edge: the hero can
          grow past 100svh when its content overflows, which puts such a strip
          below the fold and leaves the navbar stuck in light-on-dark. */}
      <div
        id="hero-sentinel"
        className="absolute inset-x-0 top-0 bottom-16 lg:bottom-20 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
