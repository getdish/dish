import 'isomorphic-unfetch'

import { createFetcher } from './createFetcher'
import { client, query_root } from './graphql'

// import { useQueryInner } from './hooks'

export function startLogging(verbose = true) {
  // dont import outside node, it accesses window
  if (process.env.NODE_ENV !== 'production') {
    const { Logger } = require('@gqless/logger')
    new Logger(client, verbose)
  }
}

export { graphql } from '@gqless/react'
export { client, query } from './graphql'
export { mutation } from './graphql/mutation'
export { resolved } from 'gqless'
export * from './types'
export * from './types-extra'
export * from './helpers'

// these hacky type defs here avoid huge slowdown in ts
// otherwise could just return query_root thats it
type Query = query_root | void
export const useQuery = <A extends Query>(): A extends void ? never : A => {
  return useQueryInner(client) as any
}

// export { useQuery } from 'gqless-hook'

// type Mutation = mutation_root | void
// export const useMutation = (): Mutation => {
//   return Hooks.useQueryInner(mutationClient) as any
// }

const graphQuery = createFetcher('query')
export function fetchQuery(query: string, variables = {}, options = {}) {
  return graphQuery(query, variables, options)
}
