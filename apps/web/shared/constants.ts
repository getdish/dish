export const OVERMIND_MUTATIONS = window['__OVERMIND_MUTATIONS']
export const rootEl = document.getElementById('root')
export const isSSR = !!window['IS_SSR_RENDERING']
export const isWorker = !rootEl && !isSSR
export const isNative = false // until we start on any native apps
export const isPreact = process.env.TARGET === 'preact'

export const drawerPad = 8
export const drawerPadLeft = 12
export const drawerBorderRadius = 25
export const searchBarTopOffset = 6
export const searchBarHeight = 53
export const pageWidthMax = 1280
export const drawerWidthMax = 900

export const LIVE_SEARCH_DOMAIN = 'https://search.rio.dishapp.com'

export const emptyObj = Object.freeze(Object.create(null))
export const emptyArr = Object.freeze([])
