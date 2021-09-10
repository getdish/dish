import { useEffect, useRef, useState } from 'react'

export const useIsMountedRef = () => {
  const isMounted = useRef(true)

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}

export const useIsMounted = (delay = 0) => {
  const [x, setX] = useState(false)
  useEffect(() => {
    if (delay) {
      const tm = setTimeout(() => {
        setX(true)
      }, delay)
      return () => {
        clearTimeout(tm)
      }
    }
    setX(true)
  }, [])
  return x
}
