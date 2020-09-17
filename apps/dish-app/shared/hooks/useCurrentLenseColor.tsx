import { useEffect, useRef } from 'react'

import { useOvermind } from '../state/om'
import { tagLenses } from '../state/tagLenses'

export const useCurrentLenseColor = (): [number, number, number] => {
  const om = useOvermind()
  const lense = om.state.home.currentStateLense
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
