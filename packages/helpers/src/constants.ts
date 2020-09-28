export const isNative = process.env.TARGET === 'native'

export const defaultSmall =
  typeof window !== 'undefined' && window.innerWidth < 440

export const supportsTouchWeb =
  typeof window !== 'undefined' && 'ontouchstart' in window

export const isSafari = (() => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent?.toLowerCase() ?? ''
    return ua.includes('safari') && !ua.includes('chrome')
  }
  return false
})()
