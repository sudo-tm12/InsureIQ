import { defineCliConfig } from 'sanity/cli'

// Replace YOUR_PROJECT_ID with the projectId from https://sanity.io/manage
export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'YOUR_PROJECT_ID',
    dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  },
})
