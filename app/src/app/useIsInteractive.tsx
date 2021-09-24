import { isSafari } from '@dish/helpers'
import { useEffect, useState } from 'react'

import { isWeb } from '../constants/constants'

export const useIsInteractive = () => {
  if (!isWeb || isSafari) {
    return true
  }
  const [val, setVal] = useState(false)
  useEffect(() => {
    if (!val) {
      let setOnce = false
      const setTrueOnce = () => {
        if (setOnce) return
        setOnce = true
        setVal(true)
      }
      // prettier-ignore
      const events = ['resize', 'mousemove', 'touchstart', 'scroll', 'click', 'focus', 'keydown'];
      // maximum 10 seconds
      const tm = setTimeout(setTrueOnce, process.env.NODE_ENV === 'development' ? 0 : 15000)
      for (const evt of events) {
        window.addEventListener(evt, setTrueOnce, true)
      }
      return () => {
        clearTimeout(tm)
        for (const evt of events) {
          window.removeEventListener(evt, setTrueOnce, true)
        }
      }
    }
  }, [val])
  return val
}
