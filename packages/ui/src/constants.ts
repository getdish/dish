import { Platform } from 'react-native'

export const isWeb = Platform.OS === 'web'
export const isBrowser = typeof document !== 'undefined'
export const isWebIOS =
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream
