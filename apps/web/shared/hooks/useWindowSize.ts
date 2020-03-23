import { useEffect, useState } from 'react'

import { useThrottledFn } from './useThrottleFn'

/** [width, height] */
type Size = [number, number]

const windowSize = (): Size => [window.innerWidth, window.innerHeight]

const idFn = (_) => _

export function useWindowSize({
  throttle = 0,
  adjust = idFn,
}: { throttle?: number; adjust?: (x: Size) => Size } = {}): Size {
  const [size, setSize] = useState(adjust(windowSize()))
  const setSizeThrottle = useThrottledFn(setSize, { amount: throttle })

  useEffect(() => {
    const update = () => setSizeThrottle(adjust(windowSize()))
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [adjust])

  return size
}
