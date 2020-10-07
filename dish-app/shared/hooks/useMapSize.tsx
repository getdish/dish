import { frameWidthMax } from '../constants'
import { getWindowWidth } from '../helpers/getWindow'
import { useAppDrawerWidth } from './useAppDrawerWidth'

const overlapAmt = 0

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useAppDrawerWidth(Infinity)
  const width = isSmall
    ? getWindowWidth()
    : Math.min(getWindowWidth(), frameWidthMax - 20) - drawerWidth + overlapAmt
  let paddingLeft = isSmall ? 0 : overlapAmt
  return { width, paddingLeft, drawerWidth }
}
