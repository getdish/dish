import { Logger } from '@gqless/logger'

import { createFetcher } from './createFetcher'
import { client, t_restaurant, t_review, t_tag, t_user } from './graphql'

export function startLogging(verbose = true) {
  new Logger(client, verbose)
}

// helper types for gqless

export type Restaurant = t_restaurant['data']
export type Tag = t_tag['data']
export type User = t_user['data']
export type Review = t_review['data']

// all other types

export * from './graphql'
export * from './graphql/mutation'
export * from 'gqless'

const graphQuery = createFetcher('query')
export function fetchQuery(query: string, variables = {}) {
  return graphQuery(query, variables)
}
