import { useEffect, useRef } from 'react'

import { tagLenses } from '../../constants/localTags'
import { useHomeStore } from '../state/home'

export const useCurrentLenseColor = (): [number, number, number] => {
  const home = useHomeStore()
  const lense = home.currentStateLense
  const lastLenseRgb = useRef(null)

  useEffect(() => {
    if (lense?.rgb) {
      const [r, g, b] = lense?.rgb
      if (r > 0 || g > 0 || b > 0) {
        lastLenseRgb.current = lense?.rgb
      }
    }
  }, [lense?.rgb])

  return lense?.rgb ?? lastLenseRgb.current ?? tagLenses[0].rgb
}
