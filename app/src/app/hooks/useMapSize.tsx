import { useMemo } from 'react'

import { pageWidthMax } from '../../constants/constants'
import { getWindow, getWindowWidth } from '../../helpers/getWindow'
import { useAppDrawerWidth } from './useAppDrawerWidth'

const overlapAmt = 0
const MAP_MAX_WIDTH = 880

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useAppDrawerWidth(Infinity)
  const frameWidth = Math.min(pageWidthMax, getWindowWidth())
  const width = isSmall
    ? getWindowWidth()
    : Math.min(MAP_MAX_WIDTH, frameWidth - drawerWidth + overlapAmt)
  let paddingLeft = isSmall ? 0 : overlapAmt
  return useMemo(() => {
    return { width, paddingLeft, drawerWidth }
  }, [width, paddingLeft, drawerWidth])
}
