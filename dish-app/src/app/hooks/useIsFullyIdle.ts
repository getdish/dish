import { FullyIdleProps, fullyIdle, series } from '@dish/async'
import { useEffect, useState } from 'react'

export const useIsFullyIdle = (props?: FullyIdleProps) => {
  const [isIdle, setIsIdle] = useState(false)

  useEffect(() => {
    return series([
      () => fullyIdle(props),
      () => {
        setIsIdle(true)
      },
    ])
  }, [])

  return isIdle
}
