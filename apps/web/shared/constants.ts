export const OVERMIND_MUTATIONS = window['__OVERMIND_MUTATIONS']
export const rootEl = document.getElementById('root')
export const isWorker = !rootEl
export const isSSR = !!window['IS_SSR_RENDERING']
export const isNative = false // until we start on any native apps
export const isPreact = process.env.TARGET === 'preact'

export const drawerPad = 8
export const drawerPadLeft = 12
export const drawerBorderRadius = 20
export const searchBarTopOffset = 6
export const searchBarHeight = 53
export const pageWidthMax = 1180
export const drawerWidthMax = 780
