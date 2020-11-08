import { useEffect } from 'react'

class AsyncCancellation {}

export function useAsyncEffect<V>(
  effect: (wait: () => boolean) => any | Promise<any>,
  inputs: any[]
) {
  useEffect(() => {
    let mounted = true
    try {
      effect(() => {
        if (!mounted) {
          throw new AsyncCancellation()
        }
        return true
      })
    } catch (err) {
      if (err instanceof AsyncCancellation) {
        return
      }
      throw err
    }
    return () => {
      mounted = false
    }
  }, inputs)
}
