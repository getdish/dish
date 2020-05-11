import { createFetcher } from './createFetcher'
import { client } from './graphql'

export function startLogging(verbose = true) {
  // dont import outside node, it accesses window
  const { Logger } = require('@gqless/logger')
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
