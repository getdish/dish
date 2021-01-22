import { useState } from 'react'

export function useLocalStorageState<A>(key: string, initialValue: A) {
  const [state, setState] = useState(() => {
    const item = localStorage.getItem(key)
    if (typeof item !== 'undefined') {
      if (typeof initialValue === 'object') {
        return JSON.parse(item as any)
      } else if (typeof initialValue === 'number') {
        return +(item ?? 0)
      } else {
        return item
      }
    }
    return initialValue
  })
  return [
    state,
    (next: A) => {
      localStorage.setItem(
        key,
        typeof next === 'object' ? JSON.stringify(next) : `${next}`
      )
      setState(next)
    },
  ] as const
}
