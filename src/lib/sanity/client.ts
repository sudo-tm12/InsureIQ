import { createClient } from '@sanity/client'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

export const sanityClient = createClient({
  // `||` (not `??`) so an empty string also falls back — createClient throws on
  // an empty projectId. 'UNCONFIGURED' never receives fetches: isSanityConfigured
  // gates every query below.
  projectId: projectId || 'UNCONFIGURED',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-05-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
})

/** True when the project ID env var is set. Fetches will be skipped and mock
 *  data used as fallback when this is false, so the build never requires CMS. */
export const isSanityConfigured = Boolean(projectId)
