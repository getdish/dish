import { useEffect } from 'react'

export const useAsyncEffect = (
  effect: (mounted: () => boolean) => Promise<any>,
  destroy?: any,
  inputs?: any
) => {
  const hasDestroyer = typeof destroy === 'function'
  useEffect(
    () => {
      let result: any
      let mounted = true
      const promiseMaybe = effect(() => mounted)
      Promise.resolve(promiseMaybe).then(function (value) {
        result = value
      })
      return () => {
        mounted = false
        hasDestroyer && destroy(result)
      }
    },
    hasDestroyer ? inputs : destroy
  )
}
