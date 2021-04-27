import { useMemo, useRef } from 'react'

// not concurrent safe

export const useLastValueWhen = <A extends any = any>(memoFn: () => A, conditional: boolean): A => {
  const key = useRef(0)
  if (!conditional) {
    key.current = Math.random()
  }
  return useMemo(() => {
    return memoFn()
  }, [key.current])
}
