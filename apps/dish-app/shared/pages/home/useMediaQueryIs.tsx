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

export const getMediaQueryMatch = (key: keyof typeof mediaQueries) => {
  return window.matchMedia(mediaObjectToString(mediaQueries[key])).matches
}

export const useMediaQueryIsShort = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.short)
  }
  return true
}

export const useMediaQueryIsReallySmall = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.xs)
  }
  return true
}

export const useMediaQueryIsSmall = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.sm)
  }
  return true
}

export const useMediaQueryIsAboveSmall = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.aboveSm)
  }
  return false
}

export const useMediaQueryIsMedium = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.md)
  }
  return false
}

export const useMediaQueryIsAboveMedium = () => {
  if (Platform.OS === 'web') {
    return use(mediaQueries.aboveMd)
  }
  return false
}
