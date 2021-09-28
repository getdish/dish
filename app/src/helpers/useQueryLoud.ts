import { useEffect } from 'react'
import { Toast } from 'snackui'
import useSWR, { SWRConfiguration } from 'swr'

// automatically logs errors to toast
// but allows things to fail without failing entire app

type QueryFunction<A> = (...args: any[]) => A | Promise<A>

export function useQueryLoud<TData = unknown, TError = unknown, TQueryFnData = TData>(
  queryKey: string,
  queryFn: QueryFunction<TQueryFnData | TData>,
  options?: SWRConfiguration<TData, TError, QueryFunction<TData>>
) {
  const res = useSWR(
    queryKey,
    async (...args) => {
      try {
        const res = await queryFn(...args)
        if (process.env.NODE_ENV === 'development' || process.env.DEBUG || process.env.LOG_FETCH) {
          console.groupCollapsed(`🔦 ${queryKey.slice(0, 50)}`)
          console.log(res)
          console.groupEnd()
        }
        return res
      } catch (err) {
        console.error(err)
        Toast.show(`Query error: ${err.message}`)
        throw err
      }
    },
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      ...options,
    }
  )

  useEffect(() => {
    if (!res.error) return
    console.error(res.error)
    Toast.show(`Fetch error: ${res.error}`)
  }, [res.error])

  return res
}
