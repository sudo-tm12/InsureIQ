import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProductCardProps {
  icon: LucideIcon
  title: string
  description: string
  features: string[]
  href: string
  featured?: boolean
  className?: string
}

export function ProductCard({
  icon: Icon,
  title,
  description,
  features,
  href,
  featured = false,
  className,
}: ProductCardProps) {
  return (
    <article
      className={cn(
        'group relative flex flex-col rounded-2xl p-8',
        'transition-all duration-[250ms] ease-out',
        featured
          ? ['bg-brand-navy text-white', 'shadow-2xl']
          : [
              'bg-white',
              'shadow-card',
              'hover:-translate-y-[6px] hover:shadow-card-hover',
            ],
        className,
      )}
    >
      {/* Most Popular badge — featured cards only */}
      {featured && (
        <div className="absolute top-6 right-6 bg-brand-cyan text-brand-indigo text-xs font-semibold font-body rounded-full px-3 py-1">
          Most Popular
        </div>
      )}

      {/* Icon */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-6 flex-shrink-0',
          featured ? 'bg-white/10' : 'bg-brand-cyan/10',
        )}
      >
        <Icon
          className="w-6 h-6 text-brand-cyan"
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3
        className={cn(
          'font-display font-bold text-h4 mb-3',
          featured ? 'text-white' : 'text-brand-navy',
        )}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={cn(
          'text-body font-body leading-relaxed mb-6',
          featured ? 'text-white/70' : 'text-brand-body',
        )}
      >
        {description}
      </p>

      {/* Features — dot list */}
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span
              className={cn(
                'w-1.5 h-1.5 rounded-full flex-shrink-0',
                featured ? 'bg-brand-cyan' : 'bg-brand-navy/25',
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                'text-body-sm font-body',
                featured ? 'text-white/80' : 'text-brand-body',
              )}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* Featured-only: saving stat block */}
      {featured && (
        <div className="flex-1 flex items-center">
          <div className="w-full rounded-2xl bg-white/8 border border-white/10 p-6">
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan/70 mb-3">
              AVERAGE CLIENT SAVING
            </p>
            <p
              className="font-display font-bold text-white leading-none mb-2"
              style={{ fontSize: 'clamp(48px, 5vw, 64px)' }}
            >
              40%
            </p>
            <p className="text-white/55 text-sm font-body leading-snug">
              compared to what most lenders charge on your outstanding balance — estimated per
              account from real provider rates.
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href={href}
        className={cn(
          'inline-flex items-center gap-1',
          'text-body-sm font-medium font-body',
          'transition-colors duration-[150ms] ease-out',
          'focus-visible:outline-none focus-visible:underline',
          'mt-auto',
          featured
            ? 'text-brand-cyan hover:text-white'
            : 'text-brand-cyan hover:text-brand-blue',
        )}
        aria-label={`Learn more about ${title}`}
      >
        Learn More <span aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
