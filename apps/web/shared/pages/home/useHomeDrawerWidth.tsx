import { useWindowSize } from '@dish/ui'

import { drawerWidthMax } from '../../constants'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize()
  let scaleFactor = 0
  if (width < 1150) {
    scaleFactor = 0.7
  } else if (width < 1350) {
    scaleFactor = 0.55
  } else {
    scaleFactor = 0.53
  }
  return Math.min(Math.max(650, width * scaleFactor), Infinity)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
