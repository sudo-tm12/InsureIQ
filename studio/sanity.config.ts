import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

// Replace YOUR_PROJECT_ID with the projectId from https://sanity.io/manage
// Or set SANITY_STUDIO_PROJECT_ID in studio/.env
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? 'YOUR_PROJECT_ID'
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production'

export default defineConfig({
  name: 'insuriq',
  title: 'InsurIQ',
  projectId,
  dataset,
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
