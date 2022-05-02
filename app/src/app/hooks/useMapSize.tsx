import { pageWidthMax } from '../../constants/constants'
import { getWindowWidth } from '../../helpers/getWindow'
import { useAppDrawerWidth } from './useAppDrawerWidth'
import { useMemo } from 'react'

const overlapAmt = 0
const MAP_MAX_WIDTH = pageWidthMax

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useAppDrawerWidth()
  const frameWidth = Math.min(pageWidthMax, getWindowWidth())
  const width = isSmall
    ? getWindowWidth()
    : Math.min(MAP_MAX_WIDTH, frameWidth - drawerWidth + overlapAmt)
  const paddingLeft = isSmall ? 0 : frameWidth - drawerWidth
  return useMemo(() => {
    return { width, paddingLeft, drawerWidth }
  }, [width, paddingLeft, drawerWidth])
}
