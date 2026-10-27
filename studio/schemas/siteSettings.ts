import type { Rule } from 'sanity'

const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type should exist.
  __experimental_actions: ['update', 'publish'],
  fields: [
    {
      name: 'tagline',
      title: 'Hero Tagline',
      type: 'string',
      description: 'Main hero headline shown on the homepage.',
    },
    {
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
      description: 'Subheading text under the hero headline.',
    },
    {
      name: 'statsBar',
      title: 'Stats Bar',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              type: 'string',
              title: 'Value',
              description: 'e.g. R2.4B+',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'e.g. Claims Paid Out',
              validation: (Rule: Rule) => Rule.required(),
            },
            {
              name: 'accentChar',
              type: 'string',
              title: 'Accent Character',
              description: 'This character renders in brand cyan, e.g. R, %, <',
            },
          ],
          preview: {
            select: { title: 'value', subtitle: 'label' },
          },
        },
      ],
      validation: (Rule: Rule) => Rule.max(4),
    },
    {
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Include country code — digits only, e.g. 27821234567',
    },
    {
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    },
    {
      name: 'fspNumber',
      title: 'FSP Licence Number',
      type: 'string',
      description: 'FSCA FSP number — appears in the footer and all compliance pages.',
    },
  ],
}

export default siteSettingsSchema
