import { mediaObjectToString, useMedia, useMediaLayout } from '@dish/ui'
import { Platform } from 'react-native'

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

export const getMediaQueryMatch = (key: keyof typeof mediaQueries) => {
  if (isWeb) {
    return window.matchMedia(mediaObjectToString(mediaQueries[key])).matches
  }
  return key === 'sm' || key === 'xs' || key === 'short'
}

export const useMediaQueryIsShort = () => {
  if (isWeb) {
    return use(mediaQueries.short)
  }
  return true
}

export const useMediaQueryIsReallySmall = () => {
  if (isWeb) {
    return use(mediaQueries.xs)
  }
  return true
}

export const useMediaQueryIsSmall = () => {
  if (isWeb) {
    return use(mediaQueries.sm)
  }
  return true
}

export const useMediaQueryIsAboveSmall = () => {
  if (isWeb) {
    return use(mediaQueries.aboveSm)
  }
  return false
}

export const useMediaQueryIsMedium = () => {
  if (isWeb) {
    return use(mediaQueries.md)
  }
  return false
}

export const useMediaQueryIsAboveMedium = () => {
  if (isWeb) {
    return use(mediaQueries.aboveMd)
  }
  return false
}
