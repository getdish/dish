import { useEffect } from 'react'

export const useDebounceEffect = (
  effect: Function,
  amount: number,
  args: any[]
) => {
  useEffect(() => {
    let dispose
    const tm = setTimeout(() => {
      dispose = effect()
    }, amount)
    return () => {
      clearTimeout(tm)
      dispose?.()
    }
  }, args)
}
