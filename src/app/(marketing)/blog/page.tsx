import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { BlogCard } from '@/components/ui/BlogCard'
import { CTABanner } from '@/components/sections/CTABanner'
import { sanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import {
  ALL_POSTS_QUERY,
  FEATURED_POST_QUERY,
  POSTS_BY_CATEGORY_QUERY,
} from '@/lib/sanity/queries'
import { CATEGORY_LABELS, type SanityPost } from '@/lib/sanity/types'
import { mockPosts, getPostsByCategory, formatDate, type BlogPost } from '@/lib/blog/mock-posts'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Insurance Insights | InsurIQ Blog',
  description:
    'Financial education on credit life insurance, debt management, and FSCA-licensed advice for South Africans.',
}

// Revalidate every 60 seconds so published Sanity posts appear promptly.
export const revalidate = 60

const CATEGORY_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Credit Life', value: 'credit-life' },
  { label: 'Advisory', value: 'advisory' },
  { label: 'Debt', value: 'debt' },
  { label: 'News', value: 'news' },
]

/** Normalise a SanityPost to the BlogPost shape BlogCard expects. */
function sanityToCard(post: SanityPost): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: '', // not needed for card display
    category: post.category,
    categoryLabel: CATEGORY_LABELS[post.category] ?? post.category,
    author: post.author,
    authorTitle: post.authorTitle ?? 'InsurIQ Editorial',
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    featured: post.featured,
    coverImage: post.coverImage
      ? urlFor(post.coverImage).width(800).height(360).url()
      : undefined,
  }
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const categoryParam = (await searchParams).category
  const activeCategory = categoryParam ?? 'all'

  let allPosts: BlogPost[] = []
  let featuredPost: BlogPost | null = null

  if (isSanityConfigured) {
    try {
      const [sanityPosts, sanityFeatured] = await Promise.all([
        activeCategory === 'all'
          ? sanityClient.fetch<SanityPost[]>(ALL_POSTS_QUERY)
          : sanityClient.fetch<SanityPost[]>(POSTS_BY_CATEGORY_QUERY, {
              category: activeCategory,
            }),
        sanityClient.fetch<SanityPost | null>(FEATURED_POST_QUERY),
      ])

      if ((sanityPosts ?? []).length > 0) {
        allPosts = (sanityPosts ?? []).map(sanityToCard)
        featuredPost = sanityFeatured ? sanityToCard(sanityFeatured) : null
      }
    } catch {
      // Sanity unreachable — fall through to mock data
    }
  }

  // Fall back to mock data when Sanity is unconfigured or empty
  if (allPosts.length === 0) {
    allPosts = getPostsByCategory(activeCategory)
    featuredPost = mockPosts.find((p) => p.featured) ?? null
  }

  const gridPosts = allPosts.filter((p) => !p.featured)

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative pt-32 pb-20 md:pt-44 md:pb-28 min-h-[40vh] flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #071840 0%, #0B2D78 100%)' }}
        aria-labelledby="blog-heading"
      >
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(93,205,230,0.10) 0%, transparent 65%)',
          }}
          aria-hidden="true"
        />
        <Container className="relative">
          <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-5">
            INSIGHTS
          </p>
          <h1
            id="blog-heading"
            className="font-display font-extrabold text-white text-balance mb-5 max-w-2xl"
            style={{ fontSize: 'clamp(36px, 5vw, 60px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}
          >
            Financial education{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(90deg, #5DCDE6 0%, #4BAEF0 100%)' }}
            >
              that actually helps.
            </span>
          </h1>
          <p className="text-[16px] text-white/65 font-body leading-relaxed max-w-xl">
            Straightforward guides on credit life insurance, debt, and financial planning for
            South Africans.
          </p>
        </Container>
      </section>

      <div className="bg-brand-cloud">
        <Container className="py-12 md:py-16">

          {/* ── FEATURED ARTICLE ── */}
          {featuredPost && (
            <div className="bg-brand-navy rounded-2xl overflow-hidden mb-10 md:mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Text */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <span className="inline-flex self-start bg-brand-cyan/20 text-brand-cyan rounded-full px-3 py-1 text-xs font-body font-medium">
                    {featuredPost.categoryLabel}
                  </span>
                  <h2 className="font-display font-bold text-white text-2xl md:text-3xl leading-snug mt-3 max-w-lg">
                    {featuredPost.title}
                  </h2>
                  <p className="text-white/65 text-[15px] font-body leading-relaxed mt-4 max-w-lg">
                    {featuredPost.excerpt}
                  </p>
                  <p className="text-white/40 text-xs font-body mt-6">
                    {featuredPost.author} · {featuredPost.readTime} min read ·{' '}
                    {formatDate(featuredPost.publishedAt)}
                  </p>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-brand-cyan font-body font-medium hover:text-white transition-colors duration-[150ms] mt-6 text-[15px]"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Visual */}
                <div className="relative min-h-[240px] overflow-hidden bg-brand-indigo">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      fill
                      className="object-cover opacity-80"
                      sizes="(max-width: 1023px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <>
                      <span
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-white/5 leading-none select-none pointer-events-none"
                        style={{ fontSize: '220px' }}
                        aria-hidden="true"
                      >
                        {featuredPost.title.charAt(0)}
                      </span>
                      <span
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display font-bold text-brand-cyan/40 text-[80px] leading-none"
                        aria-hidden="true"
                      >
                        {featuredPost.categoryLabel.charAt(0)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORY FILTER ── */}
          <div className="flex gap-2 flex-wrap mb-8" role="navigation" aria-label="Filter by category">
            {CATEGORY_FILTERS.map(({ label, value }) => {
              const isActive =
                value === activeCategory || (value === 'all' && !categoryParam)
              return (
                <Link
                  key={value}
                  href={value === 'all' ? '/blog' : `/blog?category=${value}`}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-body font-medium transition-colors duration-[150ms]',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan',
                    isActive
                      ? 'bg-brand-navy text-white'
                      : 'bg-white text-brand-muted hover:bg-brand-border',
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </Link>
              )
            })}
          </div>

          {/* ── ARTICLES GRID ── */}
          {gridPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-brand-muted font-body">No articles in this category yet.</p>
            </div>
          )}
        </Container>
      </div>

      {/* ── CTA ── */}
      <CTABanner />
    </>
  )
}
