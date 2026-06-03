import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Skip-to-content — WCAG 2.4.1 */}
      <a
        href="#main-content"
        className={[
          'sr-only',
          'focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200]',
          'focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg',
          'focus:bg-white focus:text-brand-navy',
          'focus:font-body focus:font-medium focus:text-sm',
          'focus:outline-none focus:ring-2 focus:ring-brand-cyan',
        ].join(' ')}
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  )
}
