import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { CTABanner } from '@/components/sections/CTABanner'

interface ProductHero {
  eyebrow: string
  title: string
  /** Substring of title (or separate word) that renders in brand-cyan→bright gradient. */
  gradientWord: string
  subtitle: string
  icon: LucideIcon
  stat: { value: string; label: string }
  badge?: string
}

interface ProductLayoutProps {
  hero: ProductHero
  children: React.ReactNode
}

function HeroHeading({ title, gradientWord }: { title: string; gradientWord: string }) {
  const parts = title.split(gradientWord)
  const isInline = parts.length === 2

  const gradientSpan = (
    <span
      className="bg-clip-text text-transparent"
      style={{ backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)' }}
    >
      {gradientWord}
    </span>
  )

  if (isInline) {
    return (
      <h1
        className="font-display font-bold text-white leading-tight mb-4"
        style={{ fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: '-0.025em' }}
      >
        {parts[0]}{gradientSpan}{parts[1]}
      </h1>
    )
  }

  return (
    <h1
      className="font-display font-bold text-white leading-tight mb-4"
      style={{ fontSize: 'clamp(32px, 5vw, 60px)', letterSpacing: '-0.025em' }}
    >
      <span className="block">{title}</span>
      {gradientSpan}
    </h1>
  )
}

export function ProductLayout({ hero, children }: ProductLayoutProps) {
  const Icon = hero.icon

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 min-h-[50vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        aria-labelledby="product-heading"
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(93,205,230,0.12) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden="true"
        />

        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

            {/* Left column */}
            <div className="lg:col-span-7">
              <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
                {hero.eyebrow}
              </p>

              {hero.badge && (
                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
                  <Icon className="w-3.5 h-3.5 text-brand-cyan" aria-hidden="true" />
                  <span className="text-white/70 text-xs tracking-widest uppercase font-body font-medium">
                    {hero.badge}
                  </span>
                </div>
              )}

              <HeroHeading title={hero.title} gradientWord={hero.gradientWord} />

              <p className="text-[17px] text-white/65 font-body leading-relaxed max-w-lg mt-4">
                {hero.subtitle}
              </p>

              <div className="mt-8">
                <Button
                  size="lg"
                  className="bg-white text-brand-navy hover:bg-brand-cyan hover:text-white hover:shadow-none font-bold inline-flex items-center gap-2"
                  asChild
                >
                  <Link href="/contact">
                    Get a Free Quote
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right column — stat card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center">
                <Icon className="w-16 h-16 text-brand-cyan mx-auto mb-4" aria-hidden="true" />
                <p
                  className="font-display font-bold text-white leading-none mb-3"
                  style={{ fontSize: 'clamp(40px, 5vw, 56px)' }}
                >
                  {hero.stat.value}
                </p>
                <p className="text-white/60 text-sm font-body leading-relaxed max-w-[200px] mx-auto">
                  {hero.stat.label}
                </p>
              </div>
            </div>

          </div>
        </Container>
      </section>

      {/* ── PAGE CONTENT ── */}
      {children}

      {/* ── CTA ── */}
      <CTABanner />
    </>
  )
}
