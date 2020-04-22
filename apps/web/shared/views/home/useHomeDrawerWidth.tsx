import { drawerWidthMax, pageWidthMax } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 200 })
  const pct = Math.max(0.58, Math.min(0.65, width / 1380))
  return Math.min(Math.max(520, width * pct), Infinity)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
