import { useEffect, useState } from 'react'

export const useStateSynced = <A>(val: A) => {
  const [cur, set] = useState(val)

  useEffect(() => {
    if (val !== cur) {
      set(val)
    }
  }, [val])

  return [cur, set] as const
}
