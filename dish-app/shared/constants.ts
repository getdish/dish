// dont do anything funny
// this file is statically extracted so only things that can be
// fully optmized away during compile time should go here

export const isSSR =
  process.env.IS_SSR_RENDERING || process.env.TARGET === 'ssr'
export const isWeb = process.env.TARGET === 'web'
export const isNative = process.env.TARGET === 'native'

export const drawerPad = 8
export const drawerBorderRadius = 16
export const drawerWidthMax = 940
export const drawerExtraLeftScrollSpace = 500

export const listItemMaxSideWidth = drawerWidthMax / 2.5 - 40

export const logoWidth = 1303 * 0.064
export const logoHeight = 608 * 0.064
export const logoXsWidth = 723 * 0.044
export const logoXsHeight = 898 * 0.044

export const pageWidthMax = 2000

export const searchBarTopOffset = 3
export const searchBarHeight = 50
export const searchBarMaxWidth = pageWidthMax - 640

export const LIVE_SEARCH_DOMAIN = 'https://search.dishapp.com'
export const IMAGE_PROXY_DOMAIN = 'https://images-staging.dishapp.com'

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

export const slantedBoxStyle = {
  position: 'relative',
  zIndex: 10,
  paddingVertical: 7,
  paddingHorizontal: 10,
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 6,
  shadowOffset: { height: 2, width: 0 },
  borderRadius: 5,
  transform: [{ rotate: '-2deg' }],
}
