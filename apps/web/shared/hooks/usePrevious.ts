import { useRef, useEffect } from 'react'

export function usePrevious<A>(value: A): A {
  const ref = useRef<A>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}
