import { useMemo, useRef } from 'react'

export const useLastValue = (a: any) => {
  const last = useRef(a)
  return useMemo(() => {
    try {
      return last.current
    } finally {
      last.current = a
    }
  }, [a])
}
