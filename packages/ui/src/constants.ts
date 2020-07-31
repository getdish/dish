export const isBrowser = typeof document !== 'undefined'
export const isIOS =
  typeof window !== 'undefined' &&
  (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
  !window.MSStream
