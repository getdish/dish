import { fullyIdle, series } from '@dish/async'
import { useEffect, useState } from 'react'

export const usePageFinishedLoading = () => {
  const [done, setDone] = useState(false)

  useEffect(() => {
    return series([
      //
      () => fullyIdle({ max: 1500 }),
      () => setDone(true),
    ])
  }, [])

  return done
}
