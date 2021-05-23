import { useState } from 'react'

export function useLocalStorageState<A>(key: string, initialValue: A) {
  const [state, setState] = useState(() => {
    const item = localStorage.getItem(key)
    if (item !== null) {
      return JSON.parse((item as any) ?? null)
    }
    return initialValue
  })
  return [
    state,
    (next: A) => {
      localStorage.setItem(key, typeof next === 'object' ? JSON.stringify(next) : `${next}`)
      setState(next)
    },
  ] as const
}
