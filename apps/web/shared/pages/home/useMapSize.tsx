import { frameWidthMax } from '../../constants'
import { getWindowWidth } from '../../helpers/getWindow'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'

export const useMapSize = (isSmall: boolean) => {
  const drawerWidth = useHomeDrawerWidth(Infinity)
  const width = isSmall
    ? getWindowWidth()
    : Math.min(getWindowWidth(), frameWidthMax - 20) - drawerWidth + 300
  let paddingLeft = isSmall ? 0 : 300 - 20
  return { width, paddingLeft, drawerWidth }
}
