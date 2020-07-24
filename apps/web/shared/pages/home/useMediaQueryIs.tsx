import { useMedia } from '@dish/ui'

const mediaQueries = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 860 },
  md: { maxWidth: 960 },
  aboveMd: { minWidth: 960 },
}

export const useMediaQueryIs = () => {}
export const useMediaQueryIsReallySmall = () => useMedia(mediaQueries.xs)
export const useMediaQueryIsSmall = () => useMedia(mediaQueries.sm)
export const useMediaQueryIsMedium = () => useMedia(mediaQueries.md)
export const useMediaQueryIsAboveMedium = () => useMedia(mediaQueries.aboveMd)
