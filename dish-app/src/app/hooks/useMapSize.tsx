import { useMemo } from 'react'

import { getWindowWidth } from '../../helpers/getWindow'
import { useAppDrawerWidth } from './useAppDrawerWidth'

const overlapAmt = 0
const MAP_MAX_WIDTH = 800

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useAppDrawerWidth(Infinity)
  const width = isSmall
    ? getWindowWidth()
    : Math.min(MAP_MAX_WIDTH, getWindowWidth() - drawerWidth + overlapAmt)
  let paddingLeft = isSmall ? 0 : overlapAmt
  return useMemo(() => {
    return { width, paddingLeft, drawerWidth }
  }, [width, paddingLeft, drawerWidth])
}
