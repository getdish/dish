import { useEffect } from 'react'
import {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from 'react-query'
import { Toast } from 'snackui'

// automatically logs errors to toast

export function useQueryLoud<
  TData = unknown,
  TError = unknown,
  TQueryFnData = TData
>(
  queryKey: QueryKey,
  queryFn: QueryFunction<TQueryFnData | TData>,
  options?: UseQueryOptions<TData, TError, TQueryFnData>
): UseQueryResult<TData, TError> {
  const res = useQuery(queryKey, queryFn, options)

  useEffect(() => {
    if (!res.error) return
    Toast.show(`Fetch error: ${res.error}`)
  }, [res.error])

  return res
}
