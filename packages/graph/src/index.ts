import { createFetcher } from './createFetcher'
import { client, mutation_root, query_root } from './graphql'
import * as Hooks from './hooks'

export function startLogging(verbose = true) {
  // dont import outside node, it accesses window
  if (process.env.NODE_ENV !== 'production') {
    const { Logger } = require('@gqless/logger')
    new Logger(client, verbose)
  }
}

export { graphql } from '@gqless/react'
export { query } from './graphql'
export * from './graphql/mutation'
export * from 'gqless'
export * from './types'
export * from './types-extra'

// these hacky type defs here avoid huge slowdown in ts
// otherwise could just return query_root thats it
// type Query = query_root | void
// export const useQuery = <A extends Query>(): A extends void ? never : A => {
//   return Hooks.useQueryInner(client) as any
// }

// type Mutation = mutation_root | void
// export const useMutation = (): Mutation => {
//   return Hooks.useQueryInner(mutationClient) as any
// }

const graphQuery = createFetcher('query')
export function fetchQuery(query: string, variables = {}, options = {}) {
  return graphQuery(query, variables, options)
}
