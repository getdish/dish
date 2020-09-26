export const isSafari = (() => {
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase()
    return ua.includes('safari') && !ua.includes('chrome')
  }
  return false
})()
