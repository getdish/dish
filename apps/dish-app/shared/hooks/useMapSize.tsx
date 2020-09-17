import { frameWidthMax } from '../constants'
import { getWindowWidth } from '../helpers/getWindow'
import { useAppDrawerWidth } from './useAppDrawerWidth'

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useAppDrawerWidth(Infinity)
  const width = isSmall
    ? getWindowWidth()
    : Math.min(getWindowWidth(), frameWidthMax - 20) - drawerWidth + 300
  let paddingLeft = isSmall ? 0 : 300 - 20
  return { width, paddingLeft, drawerWidth }
}
