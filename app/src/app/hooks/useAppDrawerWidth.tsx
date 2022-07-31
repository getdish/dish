import { drawerWidthMax } from '../../constants/constants'
import { media } from '../../constants/media'
import { useWindowSize } from '@dish/ui'

export const DRAWER_WIDTH_PCT = 0.6

export const useAppDrawerWidth = () => {
  const width = useWindowSize()[0]
  if (width <= media.sm.maxWidth) {
    return width
  }
  let next = width * DRAWER_WIDTH_PCT
  next = Math.max(next, media.sm.maxWidth)
  next = Math.min(next, drawerWidthMax)
  return Math.floor(next)
}
