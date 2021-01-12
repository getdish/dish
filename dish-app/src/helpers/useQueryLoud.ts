import { useEffect } from 'react'
import {
  QueryFunction,
  QueryKey,
  QueryObserverResult,
  UseQueryOptions,
  useQuery,
} from 'react-query'
import { Toast } from 'snackui'

// automatically logs errors to toast
// but allows things to fail without failing entire app

export function useQueryLoud<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData | TData>,
  options?: UseQueryOptions<TData, TError, TQueryFnData>
): QueryObserverResult<TQueryFnData, TError> {
  const res = useQuery(
    queryKey,
    async (...args) => {
      try {
        return await queryFn(...args)
      } catch (err) {
        console.error(`Query error`, queryFn)
        return null
      }
    },
    options
  )

  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      if (res.status === 'success') {
        console.groupCollapsed(`🔦 ${queryKey.slice(0, 50)}`)
        console.log(res.data)
        console.groupEnd()
      }
    }, [res.data])
  }

  useEffect(() => {
    if (!res.error) return
    console.error(res.error)
    Toast.show(`Fetch error: ${res.error}`)
  }, [res.error])

  return res
}
