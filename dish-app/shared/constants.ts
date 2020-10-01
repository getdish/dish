// dont import react-native

export const OVERMIND_MUTATIONS =
  typeof window !== 'undefined' && window['__OVERMIND_MUTATIONS']

export const rootEl =
  typeof document !== 'undefined' && document.getElementById('root')

export const isSSR =
  typeof window !== 'undefined' && !!window['IS_SSR_RENDERING']
export const isWorker = !rootEl && !isSSR
export const isWeb =
  typeof document !== 'undefined' || process.env.TARGET === 'web'
export const isNative = process.env.TARGET === 'native'

export const supportsTouchWeb =
  typeof window !== 'undefined' && 'ontouchstart' in window

export const drawerPad = 8
export const drawerBorderRadius = 16
export const drawerWidthMax = 940
export const drawerExtraLeftScrollSpace = 500

export const pageWidthMax = 1600

export const searchBarTopOffset = 4
export const searchBarHeight = 49
export const searchBarMaxWidth = pageWidthMax - 500

export const frameWidthMax = 2280

export const LIVE_SEARCH_DOMAIN = 'https://search.dishapp.com'
export const IMAGE_PROXY_DOMAIN = 'https://images.dishapp.com'

export const emptyObj = Object.freeze(Object.create(null))
export const emptyArr = Object.freeze([])

export const zIndexMap = 100
export const zIndexMapControlsUnderlay = 150
export const zIndexDrawer = 300
export const zIndexMapControls = 400
export const zIndexMapControlsUnderlaySmall = 500
export const zIndexSearchBarFloating = 450
export const zIndexGallery = 500

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibndpZW5lcnQiLCJhIjoiY2lvbWlhYjRjMDA0NnVpbTIxMHM5ZW95eCJ9.DQyBjCEuPRVt1400yejGhA'
