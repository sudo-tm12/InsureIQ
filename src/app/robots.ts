import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/constants'

/** Only production is indexable; previews and local builds are kept out of search. */
export default function robots(): MetadataRoute.Robots {
  if (process.env.VERCEL_ENV !== 'production') {
    return { rules: { userAgent: '*', disallow: '/' } }
  }
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  }
}
