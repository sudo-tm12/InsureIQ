import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/** Intrinsic dimensions of the master logo asset. */
const LOGO_WIDTH = 1432
const LOGO_HEIGHT = 414

const LOGO_SRC = {
  /** Navy wordmark — for white / light surfaces. */
  default: '/images/logo/insuriq-logo.png',
  /** White wordmark — for navy and indigo surfaces. Derived from the master. */
  reverse: '/images/logo/insuriq-logo-reverse.png',
} as const

export type LogoVariant = keyof typeof LOGO_SRC

export interface LogoProps {
  /** Which surface the logo sits on. `reverse` is the light-on-dark lockup. */
  variant?: LogoVariant
  /** Additional classes — set the height here, width follows the aspect ratio. */
  className?: string
  /**
   * Widest the logo is ever painted. Drives the generated srcset, so keep it
   * close to the real painted width — the master is 1432px and without this
   * Next serves the full-size candidate into a ~110px slot.
   */
  sizes?: string
  /** Only set on the above-the-fold navbar instance. */
  priority?: boolean
  /** Whether to link to home. Default true for nav / footer; disable in mockups. */
  linkToHome?: boolean
  /**
   * Hide from assistive tech. For stacked / cross-faded lockups where a parent
   * already supplies the accessible name.
   */
  decorative?: boolean
  /** Optional click handler — passed through to the wrapping Link */
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

/**
 * Shared brand logo — Angular Lion wordmark.
 * Use this everywhere the InsurIQ brand mark appears.
 */
export function Logo({
  variant = 'default',
  className,
  sizes = '160px',
  priority = false,
  linkToHome = true,
  decorative = false,
  onClick,
}: LogoProps) {
  // When wrapped in the home link the anchor supplies the accessible name, so
  // the image itself is decorative and must not double-announce.
  const isDecorative = decorative || linkToHome

  const image = (
    <Image
      src={LOGO_SRC[variant]}
      alt={isDecorative ? '' : 'InsurIQ'}
      aria-hidden={isDecorative || undefined}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-auto', className)}
    />
  )

  if (!linkToHome) {
    return image
  }

  return (
    <Link
      href="/"
      onClick={onClick}
      className="inline-flex flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
      aria-label="InsurIQ — home"
    >
      {image}
    </Link>
  )
}
