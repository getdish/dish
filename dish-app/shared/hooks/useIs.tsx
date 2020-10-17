import { Platform } from 'react-native'
import { mediaObjectToString, useMedia, useMediaLayout } from 'snackui'

// seems faster probably avoids multiple calls..
const use = useMediaLayout ?? useMedia

export const mediaQueries = {
  short: { maxHeight: 820 },
  xs: { maxWidth: 660 },
  sm: { maxWidth: 860 },
  aboveSm: { minWidth: 860 },
  md: { maxWidth: 960 },
  aboveMd: { minWidth: 960 },
}
const isWeb = Platform.OS === 'web'

export const getIs = (key: keyof typeof mediaQueries) => {
  if (isWeb) {
    return window.matchMedia(mediaObjectToString(mediaQueries[key])).matches
  }
  return key === 'sm' || key === 'xs' || key === 'short'
}

export const useIsShort = () => {
  return !isWeb ? true : use(mediaQueries.short)
}

export const useIsReallyNarrow = () => {
  return !isWeb ? true : use(mediaQueries.xs)
}

export const useIsNarrow = () => {
  return !isWeb ? true : use(mediaQueries.sm)
}

export const useIsMedium = () => {
  return !isWeb ? false : use(mediaQueries.md)
}

export const useIsAboveMedium = () => {
  return !isWeb ? false : use(mediaQueries.aboveMd)
}
