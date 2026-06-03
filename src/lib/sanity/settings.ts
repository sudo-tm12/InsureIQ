import { sanityClient, isSanityConfigured } from './client'
import { SITE_SETTINGS_QUERY } from './queries'
import type { SanitySiteSettings } from './types'
import { REGULATORY, CONTACT } from '@/lib/constants'

export async function getSiteSettings(): Promise<
  SanitySiteSettings & { fspNumber: string; contactEmail: string }
> {
  if (!isSanityConfigured) {
    return {
      fspNumber: REGULATORY.fspNumber,
      contactEmail: CONTACT.email,
    }
  }

  try {
    const settings = await sanityClient.fetch<SanitySiteSettings | null>(SITE_SETTINGS_QUERY)
    return {
      ...settings,
      fspNumber: settings?.fspNumber ?? REGULATORY.fspNumber,
      contactEmail: settings?.contactEmail ?? CONTACT.email,
    }
  } catch {
    return {
      fspNumber: REGULATORY.fspNumber,
      contactEmail: CONTACT.email,
    }
  }
}
