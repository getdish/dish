import { series } from '@dish/async'
import { crossLocalStorage } from 'cross-local-storage'
import { useEffect, useState } from 'react'

export function useLocalStorageState<A>(key: string, initialValue: A) {
  const [state, setState] = useState<A>()

  useEffect(() => {
    return series([
      async () => {
        const item = await crossLocalStorage.getItem(key as never)
        if (item !== null) {
          return JSON.parse((item as any) ?? null)
        }
        return initialValue
      },
      (value) => {
        setState(value)
      },
    ])
  }, [])

  return [
    state,
    async (next: A) => {
      setState(next)
      await crossLocalStorage.setItem(
        key as never,
        typeof next === 'object' ? JSON.stringify(next) : `${next}`
      )
    },
  ] as const
}
