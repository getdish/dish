import { defaultMediaQueries, useWindowSize } from 'snackui'

import { drawerWidthMax } from '../../constants/constants'

export function useAppDrawerWidth(max = drawerWidthMax): number {
  const [width] = useWindowSize()

  if (width <= defaultMediaQueries.sm.maxWidth) {
    return width
  }

  let scaleFactor = 0
  if (width < 1150) {
    scaleFactor = 0.7
  } else if (width < 1350) {
    scaleFactor = 0.65
  } else {
    scaleFactor = 0.6
  }
  return Math.min(Math.max(100, width * scaleFactor), Math.min(max, width))
}

export function useAppDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useAppDrawerWidth())
}
