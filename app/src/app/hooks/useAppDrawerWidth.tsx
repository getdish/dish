import { defaultMediaQueries, useWindowSize } from 'snackui'

import { drawerWidthMax } from '../../constants/constants'
import { getWindowWidth } from '../../helpers/getWindow'

export const getAppDrawerWidth = (max = drawerWidthMax): number => {
  const width = getWindowWidth()
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
  return Math.floor(Math.min(Math.max(100, width * scaleFactor), Math.min(max, width)))
}

export const useAppDrawerWidth = (max?: number) => {
  useWindowSize()
  return Math.min(drawerWidthMax, getAppDrawerWidth(max))
}
