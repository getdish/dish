import { useMedia, useMediaLayout } from '@dish/ui'

// seems faster probably avoids multiple calls..
const use = useMediaLayout ?? useMedia

const mediaQueries = {
  xs: { maxWidth: 660 },
  sm: { maxWidth: 860 },
  aboveSm: { minWidth: 860 },
  md: { maxWidth: 960 },
  aboveMd: { minWidth: 960 },
}

export const useMediaQueryIsReallySmall = () => use(mediaQueries.xs)
export const useMediaQueryIsSmall = () => use(mediaQueries.sm)
export const useMediaQueryIsAboveSmall = () => use(mediaQueries.aboveSm)
export const useMediaQueryIsMedium = () => use(mediaQueries.md)
export const useMediaQueryIsAboveMedium = () => use(mediaQueries.aboveMd)
