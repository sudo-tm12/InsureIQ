'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import {
  SITE,
  REGULATORY,
  PRODUCT_LINKS,
  COMPANY_LINKS,
  LEGAL_LINKS,
  SOCIAL_LINKS,
} from '@/lib/constants'
import { FooterNewsletter } from '@/components/layout/FooterNewsletter'
import { Logo } from '@/components/ui/Logo'
import { cn } from '@/lib/utils'

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function IconInstagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.632 5.905-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type SocialIconComponent = ({ className }: { className?: string }) => React.JSX.Element

const SOCIAL_ICON_MAP: Record<string, SocialIconComponent> = {
  LinkedIn: IconLinkedIn,
  Facebook: IconFacebook,
  Instagram: IconInstagram,
  X: IconX,
}

interface FooterColumnProps {
  heading: string
  links: readonly { label: string; href: string }[]
  isOpen: boolean
  onToggle: () => void
}

function FooterColumn({ heading, links, isOpen, onToggle }: FooterColumnProps) {
  return (
    <div>
      {/* Mobile: tappable header */}
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center justify-between w-full',
          'py-4 border-b border-white/10',
          'md:hidden cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded',
        )}
        aria-expanded={isOpen}
      >
        <span className="text-xs font-body font-medium uppercase tracking-widest text-white/60">
          {heading}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-white/30 transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Desktop: static heading */}
      <h3 className="hidden md:block text-xs font-medium uppercase tracking-widest text-white/40 mb-5">
        {heading}
      </h3>

      {/* Links — collapsible on mobile */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          // Mobile: collapsible
          isOpen ? 'max-h-96 pt-3 pb-2' : 'max-h-0',
          // Desktop: always visible
          'md:max-h-none md:pt-0 md:pb-0',
        )}
      >
        <ul className="space-y-3">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'text-sm text-white/70',
                  'transition-colors duration-[150ms] ease-out',
                  'hover:text-white',
                  'focus-visible:outline-none focus-visible:underline',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())

  const toggle = (heading: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(heading)) {
        next.delete(heading)
      } else {
        next.add(heading)
      }
      return next
    })
  }

  const columns = [
    { heading: 'Products', links: PRODUCT_LINKS },
    { heading: 'Company', links: COMPANY_LINKS },
    { heading: 'Legal', links: LEGAL_LINKS },
  ]

  return (
    <footer className="bg-brand-indigo text-white" aria-label="Site footer">
      {/* Gradient top border */}
      <div
        className="h-[2px]"
        style={{
          background:
            'linear-gradient(to right, transparent, #5DCDE6 50%, transparent)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        {/* Newsletter section */}
        <div className="py-10 border-b border-white/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <div>
              <h3 className="font-display font-bold text-white text-lg mb-1">
                Stay ahead of the market
              </h3>
              <p className="text-sm text-white/55 font-body">
                Financial insights, product updates, and regulatory news. No spam.
              </p>
            </div>
            <FooterNewsletter />
          </div>
        </div>

        {/* Main columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-12 py-10 md:py-16 lg:py-20">
          {/* Column 1: Brand — always visible */}
          <div className="md:col-span-2 lg:col-span-1 mb-8 md:mb-0">
            {/* The lockup's own tagline is 8.7% of its height — about 4px at any
                size this column can hold — so the slogan is set as live text
                instead. That also makes it readable by screen readers and
                search engines, which pixels in the lockup never were. */}
            <Logo variant="compact-reverse" sizes="260px" className="h-14 w-auto mb-3" />
            <p className="text-xs text-white/70 font-body uppercase tracking-widest mb-4">
              Intelligent Insurance Solutions
            </p>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              {SITE.tagline}
            </p>

            {/* Social links */}
            <div className="flex items-center justify-start gap-4" aria-label="Social media links">
              {SOCIAL_LINKS.map(({ label, href }) => {
                const Icon = SOCIAL_ICON_MAP[label]
                if (!Icon) return null
                return (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${SITE.name} on ${label}`}
                    className={cn(
                      'w-10 h-10 rounded-xl bg-white/8',
                      'flex items-center justify-center',
                      'transition-colors duration-[150ms] ease-out',
                      'hover:bg-white/20',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                    )}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Columns 2-4: accordion on mobile, normal on desktop */}
          {columns.map(({ heading, links }) => (
            <FooterColumn
              key={heading}
              heading={heading}
              links={links}
              isOpen={openSections.has(heading)}
              onToggle={() => toggle(heading)}
            />
          ))}
        </div>

        {/* Regulatory strip */}
        <div className="border-t border-white/10 py-8 space-y-2 text-[11px] text-white/40 text-center md:text-left">
          <p className="leading-relaxed">
            {REGULATORY.registeredName} is an Authorised Financial Services
            Provider.
            {REGULATORY.fspNumber && (
              <>
                {' '}FSP No: <span className="text-white/60">{REGULATORY.fspNumber}</span>.
              </>
            )}
          </p>
          <p className="leading-relaxed">
            Registered in South Africa. POPIA Compliance Officer:{' '}
            <a
              href={`mailto:${REGULATORY.popiaOfficerEmail}`}
              className="hover:text-white/70 transition-colors duration-[150ms] underline underline-offset-2"
            >
              {REGULATORY.popiaOfficerEmail}
            </a>
          </p>
          <p className="pt-2">
            © {currentYear} {REGULATORY.registeredName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
