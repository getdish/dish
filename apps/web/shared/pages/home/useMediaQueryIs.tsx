import { useMediaLayout } from '@dish/ui'

const mediaQueries = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 860 },
  aboveSm: { minWidth: 860 },
  md: { maxWidth: 960 },
  aboveMd: { minWidth: 960 },
}

export const useMediaQueryIs = () => {}
export const useMediaQueryIsReallySmall = () => useMediaLayout(mediaQueries.xs)
export const useMediaQueryIsSmall = () => useMediaLayout(mediaQueries.sm)
export const useMediaQueryIsAboveSmall = () =>
  useMediaLayout(mediaQueries.aboveSm)
export const useMediaQueryIsMedium = () => useMediaLayout(mediaQueries.md)
export const useMediaQueryIsAboveMedium = () =>
  useMediaLayout(mediaQueries.aboveMd)
