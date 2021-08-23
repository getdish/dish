import { useEffect, useRef } from 'react'

export const useLastValue = (val: any) => {
  const ref = useRef()

  useEffect(() => {
    return () => {
      ref.current = val
    }
  }, [val])

  return ref
}
