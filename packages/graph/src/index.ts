import { Logger } from '@gqless/logger'

import { createFetcher } from './createFetcher'
import { client } from './graphql'

export function startLogging(verbose = true) {
  new Logger(client, verbose)
}

export * from './graphql'
export * from './graphql/mutation'
export * from 'gqless'
export * from './types'

const graphQuery = createFetcher('query')
export function fetchQuery(query: string, variables = {}) {
  return graphQuery(query, variables)
}
