import { fullyIdle, series } from '@dish/async'
import { useEffect, useState } from 'react'

export const usePageFinishedLoading = (max?: number) => {
  const [done, setDone] = useState(false)

  useEffect(() => {
    return series([
      //
      () => fullyIdle({ max: max ?? 800 }),
      () => setDone(true),
    ])
  }, [])

  return done
}
