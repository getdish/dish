import { useEffect, useState } from 'react'

import { useDebounce } from './useDebounce'
import { useThrottledFn } from './useThrottleFn'

/** [width, height] */
type Size = [number, number]

const windowSize = (): Size => [window.innerWidth, window.innerHeight]

const idFn = (_) => _

export function useWindowSize({
  debounce = 0,
  adjust = idFn,
}: { debounce?: number; adjust?: (x: Size) => Size } = {}): Size {
  const [size, setSize] = useState(adjust(windowSize()))
  const setSizeThrottle = useDebounce(setSize, debounce)

  useEffect(() => {
    const update = () => setSizeThrottle(adjust(windowSize()))
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
    }
  }, [adjust])

  return size
}
