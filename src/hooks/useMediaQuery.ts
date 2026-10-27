'use client'

import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const media = window.matchMedia(query)
      media.addEventListener('change', onStoreChange)
      return () => media.removeEventListener('change', onStoreChange)
    },
    [query],
  )

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])

  // SSR/hydration snapshot matches the old default; the live value follows after hydration
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
