'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { MessageCircle, ChevronRight, ShieldCheck } from 'lucide-react'
import { NAV_LINKS, WHATSAPP_URL } from '@/lib/constants'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [isHeroIntersecting, setIsHeroIntersecting] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showTooltip, setShowTooltip] = useState(true)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel')
    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroIntersecting(entry.isIntersecting),
      { threshold: 0 },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [pathname])

  // The navbar sits over the dark hero only on the home page while the sentinel is in view
  const isOverDark = pathname === '/' && isHeroIntersecting

  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!isMenuOpen) return

    const menu = menuRef.current
    if (!menu) return

    const focusables = menu.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusables[0]
    const last = focusables[focusables.length - 1]

    first?.focus()
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false)
        hamburgerRef.current?.focus()
        return
      }
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  const navLinkClass = (isActive: boolean) =>
    cn(
      'relative text-[15px] font-medium font-body',
      'transition-colors duration-[250ms] ease-out',
      'after:absolute after:-bottom-0.5 after:left-0 after:h-0.5',
      'after:transition-[width] after:duration-200 after:ease-out',
      isOverDark
        ? cn(
            'after:bg-white',
            isActive
              ? 'text-white after:w-full'
              : 'text-white/75 hover:text-white after:w-0 hover:after:w-full',
          )
        : cn(
            'after:bg-brand-cyan',
            isActive
              ? 'text-brand-navy after:w-full'
              : 'text-brand-body hover:text-brand-navy after:w-0 hover:after:w-full',
          ),
    )

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-[400ms] ease-out',
          'backdrop-blur-xl',
          isOverDark
            ? 'bg-white/10 border-b border-white/15 shadow-[0_2px_24px_rgba(0,0,0,0.18)]'
            : 'bg-white/75 border-b border-white/50 shadow-[0_2px_16px_rgba(11,45,120,0.07)]',
        )}
      >
        <div className="mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          {/* Taller than a bare-logo bar because the brand block is two lines:
              lockup + slogan. Keep #hero-sentinel's bottom inset in sync. */}
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Brand block — the compact lockup with the slogan set as live text
                beneath it. The master's baked strapline renders ~4px at any size
                this bar can hold, so it is dropped from the mark and set as type
                instead, which is legible and machine-readable.
                Both lockups are stacked and cross-faded so the swap rides the
                navbar's own 400ms surface transition instead of flashing. */}
            <Link
              href="/"
              className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
              aria-label="InsurIQ — Intelligent Insurance Solutions, home"
            >
              <span className="relative block">
                <Logo
                  variant="compact"
                  linkToHome={false}
                  decorative
                  priority
                  sizes="220px"
                  className={cn(
                    'h-11 lg:h-14 w-auto transition-opacity duration-[400ms] ease-out',
                    isOverDark ? 'opacity-0' : 'opacity-100',
                  )}
                />
                <Logo
                  variant="compact-reverse"
                  linkToHome={false}
                  decorative
                  priority
                  sizes="220px"
                  className={cn(
                    'absolute inset-0 h-11 lg:h-14 w-auto transition-opacity duration-[400ms] ease-out',
                    isOverDark ? 'opacity-100' : 'opacity-0',
                  )}
                />
              </span>
              <span
                aria-hidden="true"
                className={cn(
                  'block font-body uppercase leading-none whitespace-nowrap',
                  'text-[9px] lg:text-[10px] tracking-[0.12em] mt-1 lg:mt-1.5',
                  'transition-colors duration-[400ms] ease-out',
                  isOverDark ? 'text-white/75' : 'text-brand-navy/70',
                )}
              >
                Intelligent Insurance Solutions
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={isActive ? 'page' : undefined}
                    className={navLinkClass(isActive)}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <Button
                size="sm"
                className={cn(
                  isOverDark &&
                    'bg-white text-brand-navy hover:bg-brand-cyan hover:text-white hover:shadow-none',
                )}
                asChild
              >
                <Link href="/get-quote">Get a Quote</Link>
              </Button>
            </div>

            {/* Hamburger — animated three-bar → X */}
            <button
              ref={hamburgerRef}
              className={cn(
                'md:hidden w-11 h-11 flex items-center justify-center rounded-xl flex-shrink-0',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                'transition-colors duration-[250ms]',
                isOverDark ? 'bg-white/10' : 'bg-brand-navy/8',
              )}
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="flex flex-col space-y-[5px]" aria-hidden="true">
                <span
                  className={cn(
                    'block w-5 h-[2px] rounded-full transition-all duration-[250ms] ease-in-out',
                    isOverDark ? 'bg-white' : 'bg-brand-navy',
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-[2px] rounded-full transition-all duration-[250ms] ease-in-out',
                    isOverDark ? 'bg-white' : 'bg-brand-navy',
                  )}
                />
                <span
                  className={cn(
                    'block w-5 h-[2px] rounded-full transition-all duration-[250ms] ease-in-out',
                    isOverDark ? 'bg-white' : 'bg-brand-navy',
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full screen deep indigo overlay */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className="fixed inset-0 z-50 bg-[#071840] flex flex-col pt-6 pb-10 px-6"
        >
          {/* Top row: logo + close */}
          <div className="flex items-center justify-between mb-12">
            <Link
              href="/"
              onClick={closeMenu}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
              aria-label="InsurIQ — Intelligent Insurance Solutions, home"
            >
              <Logo variant="compact-reverse" linkToHome={false} decorative sizes="220px" className="h-11 w-auto" />
              <span
                aria-hidden="true"
                className="block font-body uppercase leading-none whitespace-nowrap text-[9px] tracking-[0.12em] mt-1 text-white/75"
              >
                Intelligent Insurance Solutions
              </span>
            </Link>
            <button
              onClick={closeMenu}
              aria-label="Close navigation menu"
              className="w-11 h-11 flex items-center justify-center rounded-xl bg-white/10 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
            >
              {/* Animated X */}
              <span className="flex flex-col space-y-0 relative w-5 h-5" aria-hidden="true">
                <span className="absolute top-1/2 left-0 block w-5 h-[2px] bg-white rounded-full rotate-45" />
                <span className="absolute top-1/2 left-0 block w-5 h-[2px] bg-white rounded-full -rotate-45" />
              </span>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'flex items-center justify-between',
                    'py-4 px-4 rounded-xl',
                    'font-display font-bold text-[22px] leading-tight',
                    'border-b border-white/8',
                    'transition-colors duration-[150ms] ease-out',
                    isActive ? 'text-brand-cyan' : 'text-white',
                  )}
                >
                  {label}
                  <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" aria-hidden="true" />
                </Link>
              )
            })}
          </nav>

          {/* Bottom CTA */}
          <div className="mt-8">
            <Link
              href="/get-quote"
              onClick={closeMenu}
              className={cn(
                'flex items-center justify-center w-full h-14 rounded-2xl',
                'bg-brand-cyan text-brand-indigo',
                'font-body font-bold text-base',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-indigo',
              )}
            >
              Get a Free Quote
            </Link>
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-white/30" aria-hidden="true" />
              <p className="text-xs text-white/30 font-body">FSCA Licensed Financial Services Provider</p>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp FAB — mobile only */}
      <div className="fixed bottom-24 right-5 z-40 md:hidden">
        {showTooltip && (
          <div
            className="absolute -top-9 right-0 bg-white text-brand-navy text-xs font-body font-medium rounded-full px-3 py-1 shadow-lg whitespace-nowrap pointer-events-none"
            aria-hidden="true"
          >
            Chat with us
          </div>
        )}
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className={cn(
            'w-14 h-14 rounded-full bg-[#25D366]',
            'flex items-center justify-center',
            'shadow-lg hover:shadow-xl',
            'animate-pulse-scale',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2',
          )}
        >
          <MessageCircle className="w-7 h-7 text-white" aria-hidden="true" />
        </a>
      </div>
    </>
  )
}
