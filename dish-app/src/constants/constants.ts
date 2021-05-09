// dont do anything funny
// this file is statically extracted so only things that can be
// fully optmized away during compile time should go here

export const isSSR = process.env.IS_SSR_RENDERING || process.env.TARGET === 'ssr'
export const isWeb = process.env.TARGET === 'web'
export const isNative = process.env.TARGET === 'native'

export const isM1Sim =
  isWeb && typeof window !== 'undefined' ? window.location.search === '?m1' : false

export const drawerPad = 8
export const drawerBorderRadius = 15
export const drawerWidthMax = 940
export const drawerExtraLeftScrollSpace = 500

export const listItemMaxSideWidth = Math.round(drawerWidthMax / 2.5 - 40)

export const logoWidth = Math.round(1303 * 0.064)
export const logoHeight = Math.round(608 * 0.064)
export const logoXsWidth = Math.round(1024 * 0.044)
export const logoXsHeight = Math.round(1024 * 0.044)

export const pageWidthMax = 2000

export const searchBarTopOffset = 3
export const searchBarHeight = 50
export const searchBarHeightWithPadding = searchBarHeight + searchBarTopOffset + 12
export const searchBarMaxWidth = pageWidthMax - 640

export const IMAGE_PROXY_DOMAIN = 'https://images.dishapp.com'

export const emptyObj = Object.freeze(Object.create(null))
export const emptyArr = Object.freeze([])

export const zIndexMap = 100
export const zIndexMapControlsUnderlay = 150
export const zIndexDrawer = 300
export const zIndexMapControls = 400
export const zIndexAutocomplete = 440
export const zIndexSearchBarFloating = 450
export const zIndexMapControlsUnderlaySmall = 500
export const zIndexGallery = 500

export const cardFrameBorderRadius = 20
export const cardFrameWidth = Math.round(210 * 0.9)
export const cardFrameHeight = Math.round(230 * 0.9)
export const cardFrameWidthSm = Math.round(cardFrameWidth * 0.75)
export const cardFrameHeightSm = Math.round(cardFrameHeight * 0.75)

export const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibndpZW5lcnQiLCJhIjoiY2lvbWlhYjRjMDA0NnVpbTIxMHM5ZW95eCJ9.DQyBjCEuPRVt1400yejGhA'

// console.log('dishapp.constants', { isWeb, isNative })
