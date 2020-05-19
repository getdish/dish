import { drawerWidthMax, pageWidthMax } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ debounce: 500 })
  let scaleFactor = 0.56
  if (width < 1550) {
    scaleFactor = 0.63
  }
  if (width < 1350) {
    scaleFactor = 0.72
  }
  if (width < 1150) {
    scaleFactor = 0.74
  }
  return Math.min(Math.max(650, width * scaleFactor), Infinity)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
