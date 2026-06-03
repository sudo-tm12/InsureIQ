import { Container } from '@/components/ui/Container'

interface LegalLayoutProps {
  eyebrow: string
  title: string
  lastUpdated: string
  children: React.ReactNode
}

export function LegalLayout({ eyebrow, title, lastUpdated, children }: LegalLayoutProps) {
  return (
    <>
      {/* Dark mini-hero */}
      <div
        className="pt-28 pb-14 md:pt-36 md:pb-20"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <Container>
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
            {eyebrow}
          </p>
          <h1
            className="font-display font-extrabold text-white text-balance mb-4"
            style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>
          <p className="text-sm text-white/40 font-body">Last updated: {lastUpdated}</p>
        </Container>
      </div>

      {/* Prose content */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="legal-prose">{children}</div>
        </div>
      </div>
    </>
  )
}
