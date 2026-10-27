import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Clock, ArrowLeft } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { BlogCard } from '@/components/ui/BlogCard'
import { sanityClient, isSanityConfigured } from '@/lib/sanity/client'
import {
  POST_BY_SLUG_QUERY,
  ALL_POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from '@/lib/sanity/queries'
import { CATEGORY_LABELS, type SanityPost, type SanityBlock } from '@/lib/sanity/types'
import { urlFor } from '@/lib/sanity/image'
import {
  mockPosts,
  getPostBySlug,
  getRelatedPosts,
  formatDate,
  type BlogPost,
} from '@/lib/blog/mock-posts'
import { cn } from '@/lib/utils'

export const revalidate = 60

const CATEGORY_TAGS: Record<string, string> = {
  'credit-life': 'bg-blue-50 text-blue-700',
  advisory: 'bg-emerald-50 text-emerald-700',
  debt: 'bg-orange-50 text-orange-700',
  news: 'bg-purple-50 text-purple-700',
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

/** Normalise a SanityPost to the BlogPost shape BlogCard expects. */
function sanityToCard(post: SanityPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: '',
    category: post.category,
    categoryLabel: CATEGORY_LABELS[post.category] ?? post.category,
    author: post.author,
    authorTitle: post.authorTitle ?? 'InsurIQ Editorial',
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    featured: post.featured,
  }
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  if (isSanityConfigured) {
    try {
      const slugs = await sanityClient.fetch<Array<{ slug: string }>>(ALL_POST_SLUGS_QUERY)
      if (slugs.length > 0) return slugs
    } catch {
      // Fall through to mock slugs
    }
  }
  return mockPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  if (isSanityConfigured) {
    try {
      const post = await sanityClient.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, {
        slug,
      })
      if (post) {
        return {
          title: `${post.seo?.metaTitle ?? post.title} | InsurIQ`,
          description: post.seo?.metaDescription ?? post.excerpt,
        }
      }
    } catch {
      // Fall through to mock metadata
    }
  }
  const mock = getPostBySlug(slug)
  if (!mock) return { title: 'Article Not Found | InsurIQ' }
  return { title: `${mock.title} | InsurIQ`, description: mock.excerpt }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  let sanityPost: SanityPost | null = null
  let relatedSanity: SanityPost[] = []

  if (isSanityConfigured) {
    try {
      sanityPost = await sanityClient.fetch<SanityPost | null>(POST_BY_SLUG_QUERY, {
        slug,
      })
      if (sanityPost) {
        relatedSanity = await sanityClient.fetch<SanityPost[]>(RELATED_POSTS_QUERY, {
          slug,
          category: sanityPost.category,
        })
      }
    } catch {
      // Fall through to mock
    }
  }

  // Unified display values — prefer Sanity, fall back to mock
  let title: string
  let category: BlogPost['category']
  let categoryLabel: string
  let author: string
  let authorTitle: string
  let readTime: number
  let publishedAt: string
  let content: SanityBlock[] | string
  let coverImageUrl: string | null
  let seo: SanityPost['seo'] | undefined
  let relatedCards: BlogPost[]

  if (sanityPost) {
    title = sanityPost.title
    category = sanityPost.category
    categoryLabel = CATEGORY_LABELS[sanityPost.category] ?? sanityPost.category
    author = sanityPost.author
    authorTitle = sanityPost.authorTitle ?? 'InsurIQ Editorial'
    readTime = sanityPost.readTime
    publishedAt = sanityPost.publishedAt
    content = sanityPost.content ?? []
    coverImageUrl = sanityPost.coverImage
      ? urlFor(sanityPost.coverImage).width(1200).height(480).url()
      : null
    seo = sanityPost.seo
    relatedCards = relatedSanity.map(sanityToCard)
  } else {
    const mock = getPostBySlug(slug)
    if (!mock) notFound()
    title = mock.title
    category = mock.category
    categoryLabel = mock.categoryLabel
    author = mock.author
    authorTitle = mock.authorTitle
    readTime = mock.readTime
    publishedAt = mock.publishedAt
    content = mock.content
    coverImageUrl = mock.coverImage ?? null
    seo = undefined
    relatedCards = getRelatedPosts(mock.slug, mock.category, 2)
  }

  // Suppress unused-variable warning — seo is read by generateMetadata, not the template
  void seo

  return (
    <>
      {/* ── ARTICLE HERO ── */}
      <section
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
      >
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(93,205,230,0.10) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <div className="max-w-3xl mx-auto px-5 sm:px-6 relative">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-white/50 text-sm font-body hover:text-white transition-colors duration-[150ms] mb-6"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to Blog
          </Link>

          <div className="mb-4">
            <span
              className={cn(
                'inline-flex rounded-full px-3 py-1 text-xs font-body font-medium',
                CATEGORY_TAGS[category] ?? 'bg-white/20 text-white',
              )}
            >
              {categoryLabel}
            </span>
          </div>

          <h1
            className="font-display font-bold text-white text-balance mb-5 max-w-3xl"
            style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
          >
            {title}
          </h1>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-white/50 text-sm font-body">
            <span>{author}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {readTime} min read
            </span>
            <span aria-hidden="true">·</span>
            <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
          </div>
        </div>
      </section>

      {/* ── COVER IMAGE ── */}
      {coverImageUrl && (
        <div className="relative h-[260px] md:h-[420px] overflow-hidden bg-brand-cloud">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      )}

      {/* ── ARTICLE BODY ── */}
      <div className="bg-white py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="legal-prose article-prose">
            {Array.isArray(content) ? (
              // Sanity Portable Text
              <PortableText value={content} />
            ) : (
              // Mock plain-text content — split into paragraphs
              content
                .split('\n\n')
                .map((p) => p.trim())
                .filter(Boolean)
                .map((paragraph, i) => <p key={i}>{paragraph}</p>)
            )}
          </div>
        </div>
      </div>

      {/* ── AUTHOR BIO ── */}
      <div className="bg-white pb-12 md:pb-16">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="bg-brand-cloud rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-navy flex items-center justify-center flex-shrink-0">
              <span className="text-white font-display font-bold text-lg leading-none">
                {author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-body font-semibold text-brand-navy text-[15px]">{author}</p>
              <p className="text-brand-muted text-sm font-body">{authorTitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED ARTICLES ── */}
      {relatedCards.length > 0 && (
        <div className="bg-white pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto px-5 sm:px-6">
            <h2 className="font-display font-bold text-brand-navy text-xl mb-6">
              More from InsurIQ
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedCards.map((related) => (
                <BlogCard key={related.slug} post={related} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ARTICLE CTA ── */}
      <div className="bg-white pb-16 md:pb-20">
        <div className="max-w-3xl mx-auto px-5 sm:px-6">
          <div className="bg-brand-navy rounded-2xl p-8 text-center">
            <h2 className="font-display font-bold text-white text-xl mb-2">
              Ready to get covered?
            </h2>
            <p className="text-white/60 text-sm font-body mt-2 mb-6">
              Get your free quote in under 60 seconds.
            </p>
            <Link
              href="/get-quote"
              className="inline-flex items-center gap-2 bg-white text-brand-navy font-body font-bold text-[15px] px-8 py-3.5 rounded-xl hover:bg-brand-cyan hover:text-white transition-all duration-[250ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy"
            >
              Get My Free Quote →
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
