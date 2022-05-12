import { isWeb } from '../constants/constants'
import { getWindowHeight, getWindowWidth } from '../helpers/getWindow'
import { isTouchDevice, useWindowSize } from '@dish/ui'

export const useIsMobileDevice = () => {
  const size = useWindowSize()
  return Math.min(size[0], size[1]) < 480 && isWeb && isTouchDevice
}
