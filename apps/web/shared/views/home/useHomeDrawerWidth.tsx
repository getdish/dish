import { drawerWidthMax, pageWidthMax } from '../../constants'
import { useWindowSize } from '../../hooks/useWindowSize'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 200 })
  let pct = 0.55
  if (width < 900) {
    const scale = Math.max(0, width - 800) / 100
    const extraPct = scale * 0.1
    pct = pct + extraPct
  }
  return Math.min(Math.max(560, width * pct), Infinity)
}

export function useHomeDrawerWidthInner(): number {
  return Math.min(drawerWidthMax, useHomeDrawerWidth())
}
