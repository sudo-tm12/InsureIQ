'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
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
  const sectionRef = useRef<HTMLElement>(null)

  // 0 while the hero sits at the top of the viewport, 1 once its bottom edge
  // has travelled up to meet it. Drives every scroll-linked value below.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // Layers move at different rates to build depth. Transform and opacity only,
  // so all of this stays on the compositor and never triggers layout.
  const backdropY = useTransform(scrollYProgress, [0, 1], ['0%', '14%'])
  const glowY = useTransform(scrollYProgress, [0, 1], ['0%', '-9%'])
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0])
  const cueOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  // Reduced motion gets the composition without the movement.
  function parallax<T>(value: MotionValue<T>) {
    return prefersReduced ? undefined : value
  }

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
      ref={sectionRef}
      className="relative min-h-[100svh] flex flex-col overflow-hidden overflow-x-hidden"
      style={{
        background:
          'linear-gradient(145deg, #071840 0%, #0B2D78 55%, #0d3590 100%)',
      }}
      aria-labelledby="hero-heading"
    >
      {/* Faceted backdrop. Sits on top of the base gradient, which stays behind
          it so the hero is legible from first paint whether or not this loads.
          Over-tall so the parallax travel never exposes an edge. */}
      <motion.div
        className="absolute inset-x-0 -top-[15%] h-[130%] pointer-events-none"
        style={{ y: parallax(backdropY) }}
        aria-hidden="true"
      >
        <Image
          src="/images/hero/hero-facets.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-right opacity-70"
        />
      </motion.div>

      {/* Contrast scrims. The backdrop's light break is bright enough to eat
          white text, so the navbar band and the headline column are held down
          to a guaranteed-dark floor rather than left to chance. */}
      <div
        className="absolute inset-x-0 top-0 h-40 lg:h-52 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(7,24,64,0.92) 0%, rgba(7,24,64,0) 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(100deg, rgba(7,24,64,0.94) 0%, rgba(7,24,64,0.82) 38%, rgba(7,24,64,0.28) 68%, rgba(7,24,64,0) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Decorative glows — desktop only */}
      <motion.div
        className="hidden md:block absolute -top-40 -right-40 w-[900px] h-[900px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(93,205,230,0.10) 0%, transparent 65%)',
          y: parallax(glowY),
        }}
        aria-hidden="true"
      />
      <motion.div
        className="hidden md:block absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(75,174,240,0.08) 0%, transparent 65%)',
          y: parallax(glowY),
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
      <Container className="relative w-full max-w-full flex-1 flex flex-col pt-32 pb-10 lg:pt-24 lg:pb-10 lg:justify-center lg:max-w-6xl">
        <motion.div
          className="flex-1 flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 lg:items-center lg:flex-none"
          style={{ y: parallax(contentY), opacity: parallax(contentOpacity) }}
        >

          {/* ── Left column ── */}
          <div className="lg:col-span-7 flex-1 flex flex-col justify-between lg:justify-center">

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

              {/* H1 — plain element (not motion) so it's visible at FCP for optimal LCP.
                  Sized so each line fits its column without fragmenting: at the
                  previous 68px, "works for you." measured 711px against a 528px
                  column, so every line broke. That also pushed the hero past
                  100svh, which is what destabilised the navbar's dark/light
                  switch. Re-measure before increasing these.

                  Mobile is fluid because "Insurance" is the longest unbroken
                  word in the headline: at a flat 42px it measured 319px against
                  a 312px column on a 375px phone, and overflow-wrap split it
                  into "Insuranc / e". The clamp keeps it inside the column from
                  320px up. */}
              <h1
                id="hero-heading"
                className="font-display font-extrabold leading-none whitespace-normal break-words hyphens-none w-full mb-4 lg:mb-6 text-[clamp(28px,10vw,52px)] md:text-[52px] lg:text-[46px] xl:text-[54px] 2xl:text-[60px]"
                style={{ letterSpacing: '-0.03em' }}
              >
                <span className="text-white lg:block">Insurance </span>
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
                  Transparent cover, honest advice, and real debt support. No jargon. No hidden fees.
                </span>
                <span className="hidden lg:inline">
                  Cover, advice, and debt support — transparent, affordable, and
                  built for South Africans who deserve better.
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
                      className="w-3 h-3 text-brand-cyan/80 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {/* white/45 measured 4.08:1 against the backdrop — under AA
                        for text this size. */}
                    <span className="text-[11px] text-white/70 font-body">
                      {signal}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ── Right column: phone mockup — desktop only ── */}
          <div className="hidden lg:flex lg:col-span-5 justify-end">
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

        </motion.div>
      </Container>

      {/* Scroll cue — fades out as soon as the visitor starts moving, so it
          reads as an invitation rather than persistent chrome. */}
      {/* Aligned to the content column rather than the viewport centre: dead
          centre puts it over the backdrop's light break, where it measured
          1.6:1. Here the scrim guarantees a dark ground. */}
      <motion.div
        className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-full max-w-6xl px-8 pointer-events-none"
        style={{ opacity: parallax(cueOpacity) }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-start gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/60 font-body">
            Scroll
          </span>
          <span className="relative flex h-9 w-[22px] items-start justify-center rounded-full border border-white/40 p-1.5">
            <motion.span
              className="block h-1.5 w-1.5 rounded-full bg-brand-cyan"
              animate={prefersReduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.9, ease: 'easeInOut', repeat: Infinity }}
            />
          </span>
        </div>
      </motion.div>

      {/* Bottom fade — softens transition into next section */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Sentinel — IntersectionObserver target for Navbar.
          Spans the hero minus the navbar band (h-20 / lg:h-24), so the navbar
          flips to its light treatment exactly as the hero's bottom edge passes
          under it. Must not be a strip at the hero's bottom edge: the hero can
          grow past 100svh when its content overflows, which puts such a strip
          below the fold and leaves the navbar stuck in light-on-dark. */}
      <div
        id="hero-sentinel"
        className="absolute inset-x-0 top-0 bottom-20 lg:bottom-24 pointer-events-none"
        aria-hidden="true"
      />
    </section>
  )
}
