import { isTouchDevice, useWindowSize } from '@dish/ui'

import { isWeb } from '../constants/constants'
import { getWindowHeight, getWindowWidth } from '../helpers/getWindow'

export const useIsMobilePhone = () => {
  const size = useWindowSize()
  return Math.min(size[0], size[1]) < 480 && isWeb && isTouchDevice
}
