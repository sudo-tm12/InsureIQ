import type { Rule } from 'sanity'

const testimonialSchema = {
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    {
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 3,
      validation: (Rule: Rule) => Rule.required().max(300),
    },
    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      description: 'Use first name + last initial only, e.g. Thabo M.',
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: 'authorLocation',
      title: 'Location',
      type: 'string',
      description: 'e.g. Johannesburg',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: {
        list: [3, 4, 5],
      },
      initialValue: 5,
    },
    {
      name: 'productType',
      title: 'Product',
      type: 'string',
      options: {
        list: [
          { title: 'Credit Life Insurance', value: 'Credit Life Insurance' },
          { title: 'Financial Advisory', value: 'Financial Advisory' },
          { title: 'Debt Management', value: 'Debt Management' },
        ],
      },
    },
    {
      name: 'active',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'authorName',
      subtitle: 'quote',
    },
  },
}

export default testimonialSchema
