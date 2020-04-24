import { drawerWidthMax, pageWidthMax } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 200 })
  return Math.min(Math.max(560, width * 0.65), Infinity)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
