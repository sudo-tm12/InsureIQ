export const ALL_POSTS_QUERY = `
  *[_type == "post"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    authorTitle,
    readTime,
    publishedAt,
    featured,
    coverImage { asset, alt }
  }
`

export const FEATURED_POST_QUERY = `
  *[_type == "post" && featured == true][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    readTime,
    publishedAt,
    coverImage { asset, alt }
  }
`

export const POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    content,
    category,
    author,
    authorTitle,
    readTime,
    publishedAt,
    coverImage { asset, alt },
    seo
  }
`

export const POSTS_BY_CATEGORY_QUERY = `
  *[_type == "post" && category == $category] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    readTime,
    publishedAt,
    featured
  }
`

export const RELATED_POSTS_QUERY = `
  *[_type == "post" && category == $category && slug.current != $slug]
  | order(publishedAt desc)[0...2] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    category,
    author,
    readTime,
    publishedAt,
    featured
  }
`

export const ALL_POST_SLUGS_QUERY = `
  *[_type == "post"] { "slug": slug.current }
`

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    tagline,
    heroSubheading,
    statsBar,
    whatsappNumber,
    contactEmail,
    fspNumber
  }
`

export const TESTIMONIALS_QUERY = `
  *[_type == "testimonial" && active == true] | order(_createdAt asc) {
    _id,
    quote,
    authorName,
    authorLocation,
    rating,
    productType
  }
`
