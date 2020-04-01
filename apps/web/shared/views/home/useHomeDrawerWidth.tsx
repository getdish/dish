import { useWindowSize } from '../../hooks/useWindowSize'

export function useHomeDrawerWidth(): number {
  const [width] = useWindowSize({ throttle: 200 })
  return Math.min(Math.max(550, width * 0.57), 640)
}
