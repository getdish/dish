import { useMemo, useRef } from 'react'

export const useLastValueWhen = <A extends () => any>(
  memoFn: A,
  conditional: boolean
): ReturnType<A> => {
  const key = useRef(null)
  if (!conditional) {
    key.current = Math.random()
  }
  return useMemo(() => {
    return memoFn()
  }, [key.current])
}
