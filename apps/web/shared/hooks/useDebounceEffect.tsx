import { useEffect } from 'react'

export const useDebounceEffect = (
  effect: Function,
  amount: number,
  args: any[]
) => {
  useEffect(() => {
    const dispose = effect()
    const tm = setTimeout(() => {}, amount)
    return () => {
      clearTimeout(tm)
      dispose?.()
    }
  }, args)
}
