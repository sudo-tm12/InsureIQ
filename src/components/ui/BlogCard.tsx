import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { type BlogPost } from '@/lib/blog/mock-posts'
import { cn } from '@/lib/utils'

const CATEGORY_GRADIENTS: Record<BlogPost['category'], string> = {
  'credit-life': 'from-brand-navy to-[#0d3590]',
  advisory: 'from-brand-blue to-brand-mid',
  debt: 'from-brand-indigo to-brand-navy',
  news: 'from-[#0d3590] to-brand-blue',
}

const CATEGORY_TAGS: Record<BlogPost['category'], string> = {
  'credit-life': 'bg-blue-50 text-blue-700',
  advisory: 'bg-emerald-50 text-emerald-700',
  debt: 'bg-orange-50 text-orange-700',
  news: 'bg-purple-50 text-purple-700',
}

interface BlogCardProps {
  post: BlogPost
}

export function BlogCard({ post }: BlogCardProps) {
  const ghostWords = post.title.split(' ').slice(0, 2).join(' ')

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-2xl overflow-hidden',
        'shadow-card hover:shadow-card-hover',
        'transition-all duration-300 hover:-translate-y-1',
      )}
    >
      {/* Thumbnail */}
      <div className="relative h-[180px] overflow-hidden">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
          />
        ) : (
          <div
            className={cn(
              'w-full h-full flex items-center justify-center bg-gradient-to-br',
              CATEGORY_GRADIENTS[post.category],
            )}
          >
            <span
              className="absolute font-display font-bold text-white/5 leading-none select-none pointer-events-none"
              style={{ fontSize: '80px' }}
              aria-hidden="true"
            >
              {ghostWords}
            </span>
            <span className="relative text-white/30 font-display font-bold text-4xl" aria-hidden="true">
              {post.categoryLabel.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Category tag */}
        <span
          className={cn(
            'inline-flex self-start rounded-full px-3 py-1 text-xs font-body font-medium',
            CATEGORY_TAGS[post.category],
          )}
        >
          {post.categoryLabel}
        </span>

        {/* Title */}
        <h3 className="font-display font-bold text-brand-navy text-[17px] leading-snug mt-3 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-brand-muted text-[13px] font-body leading-relaxed mt-2 line-clamp-3 flex-1">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-brand-muted" aria-hidden="true" />
            <span className="text-xs text-brand-muted font-body">{post.readTime} min read</span>
          </div>
          <span className="text-brand-cyan text-sm font-body font-medium group-hover:text-brand-blue transition-colors duration-[150ms]">
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}
