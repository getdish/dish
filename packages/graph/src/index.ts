import { Logger } from '@gqless/logger'

import { createFetcher } from './createFetcher'
import { client, restaurant, review, tag, user } from './graphql'

export function startLogging(verbose = true) {
  new Logger(client, verbose)
}

// helper types for gqless

export type Restaurant = restaurant
export type Tag = tag
export type User = user
export type Review = review

// all other types

export * from './graphql'
export * from './graphql/mutation'
export * from 'gqless'

const graphQuery = createFetcher('query')
export function fetchQuery(query: string, variables = {}) {
  return graphQuery(query, variables)
}
