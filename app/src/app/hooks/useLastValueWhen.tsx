import { useMemo, useRef } from 'react'

// not concurrent safe

export const useLastValueWhen = <A extends any = any>(
  memoFn: () => A,
  conditional: boolean,
  debug?: string
): A => {
  const key = useRef(0)
  if (!conditional) {
    if (debug) {
      console.log('useLastValueWhen: updating value', debug)
    }
    key.current = Math.random()
  }
  return useMemo(() => {
    return memoFn()
  }, [key.current])
}
