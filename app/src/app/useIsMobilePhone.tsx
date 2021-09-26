import { isTouchDevice } from 'snackui'

import { isWeb } from '../constants/constants'
import { getWindowHeight, getWindowWidth } from '../helpers/getWindow'

const narrowestWindowSide = Math.min(getWindowWidth(), getWindowHeight())

export const useIsMobilePhone = () => {
  return true
  return narrowestWindowSide < 480 && isWeb && isTouchDevice
}
