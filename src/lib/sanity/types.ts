/** Raw Sanity image reference as returned by GROQ. */
export interface SanityImageRef {
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt: string
}

/** A single Portable Text block or inline image as returned by Sanity. */
export interface SanityBlock {
  _type: string
  _key?: string
  [key: string]: unknown
}

export type SanityPostCategory = 'credit-life' | 'advisory' | 'debt' | 'news'

export interface SanityPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  /** Portable Text block array. Only present on full-post queries. */
  content?: SanityBlock[]
  category: SanityPostCategory
  author: string
  authorTitle?: string
  readTime: number
  publishedAt: string
  featured: boolean
  coverImage?: SanityImageRef
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
}

export interface SanitySiteSettings {
  tagline?: string
  heroSubheading?: string
  statsBar?: Array<{
    value: string
    label: string
    accentChar?: string
  }>
  whatsappNumber?: string
  contactEmail?: string
  fspNumber?: string
}

export interface SanityTestimonial {
  _id: string
  quote: string
  authorName: string
  authorLocation?: string
  rating: number
  productType?: string
}

/** Category label lookup for display. */
export const CATEGORY_LABELS: Record<SanityPostCategory, string> = {
  'credit-life': 'Credit Life',
  advisory: 'Advisory',
  debt: 'Debt',
  news: 'News',
}
