import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'
import { mockPosts } from '@/lib/blog/mock-posts'
import { sanityClient, isSanityConfigured } from '@/lib/sanity/client'
import { ALL_POST_SLUGS_QUERY } from '@/lib/sanity/queries'

const PAGES: ReadonlyArray<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/get-quote', priority: 0.9 },
  { path: '/products', priority: 0.8 },
  { path: '/products/credit-life-insurance', priority: 0.8 },
  { path: '/products/financial-advisory', priority: 0.7 },
  { path: '/products/debt-management', priority: 0.7 },
  { path: '/how-it-works', priority: 0.7 },
  { path: '/about', priority: 0.6 },
  { path: '/contact', priority: 0.6 },
  { path: '/blog', priority: 0.6 },
  { path: '/privacy-policy', priority: 0.3 },
  { path: '/terms', priority: 0.3 },
  { path: '/fais-disclosure', priority: 0.3 },
  { path: '/conflict-of-interest', priority: 0.3 },
  { path: '/complaints', priority: 0.3 },
]

/** Same source order as the blog routes: Sanity when configured, else the mock posts. */
async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  if (isSanityConfigured) {
    try {
      const slugs = await sanityClient.fetch<Array<{ slug: string }>>(ALL_POST_SLUGS_QUERY)
      if (slugs.length > 0) {
        return slugs.map(({ slug }) => ({ url: `${SITE.url}/blog/${slug}`, priority: 0.5 }))
      }
    } catch {
      // Fall through to mock posts
    }
  }
  return mockPosts.map((post) => ({
    url: `${SITE.url}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    priority: 0.5,
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = PAGES.map(({ path, priority }) => ({
    url: path === '/' ? SITE.url : `${SITE.url}${path}`,
    priority,
  }))
  return [...pages, ...(await blogEntries())]
}
