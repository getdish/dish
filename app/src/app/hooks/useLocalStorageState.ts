import { series } from '@dish/async'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect, useState } from 'react'

export function useLocalStorageState<A>(key: string, initialValue: A) {
  const [state, setState] = useState<A>()

  useEffect(() => {
    return series([
      async () => {
        const item = await AsyncStorage.getItem(key)
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
      await AsyncStorage.setItem(
        key,
        typeof next === 'object' ? JSON.stringify(next) : `${next}`
      )
    },
  ] as const
}
