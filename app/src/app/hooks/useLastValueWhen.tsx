import { useMemo, useRef } from 'react'

// not concurrent safe

export function useLastValueWhen<A>(memoFn: () => A, conditional: boolean): A {
  const key = useRef(0)
  if (!conditional) key.current = Math.random()
  return useMemo(() => memoFn(), [key.current])
}
