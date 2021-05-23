import { useMemo, useRef } from 'react'

export const useLastValue = (a: any) => {
  const last = useRef(a)
  return useMemo(() => {
    const val = last.current
    last.current = a
    return val
  }, [a])
}
