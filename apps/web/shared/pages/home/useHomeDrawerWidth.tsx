import { useWindowSize } from '@dish/ui'

import { drawerWidthMax } from '../../constants'
import { mediaQueries } from './useMediaQueryIs'

export function useHomeDrawerWidth(max = drawerWidthMax): number {
  const [width] = useWindowSize()

  if (width <= mediaQueries.sm.maxWidth) {
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
  return Math.min(Math.max(100, width * scaleFactor), max)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
