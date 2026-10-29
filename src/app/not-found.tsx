import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

const HELPFUL_LINKS = [
  { label: 'Get a quote', href: '/get-quote' },
  { label: 'Our products', href: '/products' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Contact us', href: '/contact' },
] as const

/** Unmatched URLs render outside the (marketing) group, so the chrome is added here. */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <div
          className="pt-32 pb-24 md:pt-40 md:pb-32"
          style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        >
          <Container>
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-4">
              ERROR 404
            </p>
            <h1
              className="font-display font-extrabold text-white text-balance mb-4"
              style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
            >
              We can&apos;t find that page.
            </h1>
            <p className="text-[15px] text-white/65 font-body leading-relaxed max-w-lg mb-8">
              The link may be out of date, or the page may have moved. Here are some places to
              start instead.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button asChild variant="secondary" size="lg">
                <Link href="/">Back to home</Link>
              </Button>
            </div>
            <nav aria-label="Helpful links">
              <ul className="flex flex-wrap gap-x-8 gap-y-4">
                {HELPFUL_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm font-body font-medium text-white/80 underline underline-offset-4 hover:text-brand-cyan transition-colors duration-[150ms]"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  )
}
