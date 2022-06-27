import { isWeb } from '../constants/constants'
import { useIsTouchDevice, useWindowSize } from '@dish/ui'

export const useIsMobileDevice = () => {
  const size = useWindowSize()
  const isTouchDevice = useIsTouchDevice()
  return Math.min(size[0], size[1]) < 480 && isWeb && isTouchDevice
}
