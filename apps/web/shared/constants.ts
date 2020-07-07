export const OVERMIND_MUTATIONS =
  typeof window !== 'undefined' && window['__OVERMIND_MUTATIONS']
export const rootEl =
  typeof document !== 'undefined' && document.getElementById('root')
export const isSSR =
  typeof window !== 'undefined' && !!window['IS_SSR_RENDERING']
export const isWorker = !rootEl && !isSSR
export const isNative = false // until we start on any native apps
export const isPreact = process.env.TARGET === 'preact'

export const drawerPad = 8
export const drawerBorderRadius = 16
export const searchBarTopOffset = 4
export const searchBarHeight = 54
export const frameWidthMax = 1880
export const pageWidthMax = 1380
export const drawerWidthMax = 930

export const LIVE_SEARCH_DOMAIN = 'https://search.rio.dishapp.com'
export const IMAGE_PROXY_DOMAIN = 'https://images.rio.dishapp.com'

export const emptyObj = Object.freeze(Object.create(null))
export const emptyArr = Object.freeze([])
