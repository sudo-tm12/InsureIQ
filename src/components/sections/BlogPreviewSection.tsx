import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { BlogCard } from '@/components/ui/BlogCard'
import { sanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { urlFor } from '@/lib/sanity/image'
import { ALL_POSTS_QUERY } from '@/lib/sanity/queries'
import { CATEGORY_LABELS, type SanityPost } from '@/lib/sanity/types'
import { mockPosts, type BlogPost } from '@/lib/blog/mock-posts'

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
    coverImage: post.coverImage
      ? urlFor(post.coverImage).width(800).height(360).url()
      : undefined,
  }
}

export async function BlogPreviewSection() {
  let posts: BlogPost[] = []

  if (isSanityConfigured) {
    try {
      const sanityPosts = await sanityClient.fetch<SanityPost[]>(ALL_POSTS_QUERY)
      if ((sanityPosts ?? []).length > 0) {
        posts = sanityPosts.slice(0, 3).map(sanityToCard)
      }
    } catch {
      // Fall through to mock
    }
  }

  if (posts.length === 0) {
    posts = mockPosts.filter((p) => !p.featured).slice(0, 3)
  }

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-brand-cloud">
      <Container>
        {/* Header row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10 md:mb-14">
          <div>
            <p className="text-[11px] font-body font-medium uppercase tracking-widest text-brand-cyan mb-3">
              INSIGHTS
            </p>
            <h2
              className="font-display font-bold text-brand-navy tracking-tight text-balance"
              style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.1 }}
            >
              Latest from our blog.
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-brand-blue font-body font-medium text-[15px] hover:text-brand-navy transition-colors duration-[150ms] flex-shrink-0"
          >
            View all articles
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </Container>
    </section>
  )
}
