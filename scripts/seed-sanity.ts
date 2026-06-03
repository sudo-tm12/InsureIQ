/**
 * Seed script — imports the 6 mock blog posts into Sanity so Eddie sees
 * real content in the CMS immediately after setup.
 *
 * Usage (from project root):
 *   npm run seed
 *
 * Prerequisites:
 *   - SANITY_PROJECT_ID and SANITY_API_TOKEN set in .env.local
 *   - The SANITY_API_TOKEN must have Editor (or Developer) role — not Viewer.
 *
 * Safe to run multiple times: the script checks for existing slugs and skips
 * any post that is already in the dataset.
 */

import { createClient } from '@sanity/client'
import { mockPosts } from '../src/lib/blog/mock-posts'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: 'production',
  apiVersion: '2026-05-01',
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

async function seed() {
  if (!process.env.SANITY_PROJECT_ID || !process.env.SANITY_API_TOKEN) {
    console.error('ERROR: SANITY_PROJECT_ID and SANITY_API_TOKEN must be set in .env.local')
    process.exit(1)
  }

  console.log('Checking for existing posts in Sanity...')

  const existing = await client.fetch<Array<{ slug: string }>>(
    `*[_type == "post"] { "slug": slug.current }`,
  )
  const existingSlugs = new Set(existing.map((p) => p.slug))

  let created = 0
  let skipped = 0

  for (const post of mockPosts) {
    if (existingSlugs.has(post.slug)) {
      console.log(`  SKIP (exists): ${post.slug}`)
      skipped++
      continue
    }

    await client.create({
      _type: 'post',
      title: post.title,
      slug: { _type: 'slug', current: post.slug },
      excerpt: post.excerpt,
      category: post.category,
      author: post.author,
      authorTitle: post.authorTitle,
      readTime: post.readTime,
      publishedAt: new Date(post.publishedAt).toISOString(),
      featured: post.featured,
      content: [
        {
          _type: 'block',
          _key: 'intro',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 'text',
              text: post.content,
              marks: [],
            },
          ],
        },
      ],
    })

    console.log(`  CREATED: ${post.title}`)
    created++
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
