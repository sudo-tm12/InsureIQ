import type { Rule } from 'sanity'

const postSchema = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: Rule) => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule: Rule) => Rule.required().max(300),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
              validation: (Rule: Rule) =>
                Rule.required().error('Alt text is required for accessibility'),
            },
          ],
        },
      ],
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Life', value: 'credit-life' },
          { title: 'Advisory', value: 'advisory' },
          { title: 'Debt', value: 'debt' },
          { title: 'News', value: 'news' },
        ],
      },
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'InsurIQ Editorial',
    },
    {
      name: 'authorTitle',
      title: 'Author Title',
      type: 'string',
      initialValue: 'Financial Education',
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      validation: (Rule: Rule) => Rule.required().min(1).max(60),
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false,
      description: 'Show as the featured article on the blog index. Only one post should be featured at a time.',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt text',
          validation: (Rule: Rule) => Rule.required(),
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          type: 'string',
          title: 'Meta Title',
          description: 'Overrides the post title in search results. Max 60 characters.',
          validation: (Rule: Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          type: 'string',
          title: 'Meta Description',
          description: 'Overrides the excerpt in search results. Max 160 characters.',
          validation: (Rule: Rule) => Rule.max(160),
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'coverImage',
    },
  },
  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
}

export default postSchema
