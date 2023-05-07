import { useEffect, useState } from 'react'

export const useStateSynced = <A,>(next: A) => {
  const [cur, set] = useState(next)

  useEffect(() => {
    if (next !== cur) {
      set(next)
    }
  }, [next])

  return [cur, set] as const
}
