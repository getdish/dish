import { query } from '@dish/graph'
import { useState } from 'react'

type QueryKeys = keyof typeof query
type ValidQueryKeys = Exclude<QueryKeys, '__typename'>
type QueryFunction = typeof query[ValidQueryKeys]

export const useQueryPaginated = <A extends QueryFunction>({
  query,
  queryAggregate,
  params,
  perPage = 10,
  initialPage = 1,
}: {
  query: A
  queryAggregate: any
  params: A extends (params: infer X) => any ? X : unknown
  perPage?: number
  initialPage?: number
}): {
  results: A extends (params: any) => infer X ? X : unknown
  total: number
  totalPages: number
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
} => {
  const [page, setPage] = useState(initialPage)
  const results = query({
    ...params,
    limit: perPage,
    offset: (page - 1) * perPage,
  } as any) as any
  const total = queryAggregate(params).aggregate.count() ?? 0
  const totalPages = Math.ceil(total / perPage)
  return {
    results,
    total,
    totalPages,
    page,
    setPage,
  }
}
