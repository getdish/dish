import 'isomorphic-unfetch'
import '@dish/helpers/polyfill'

export { graphql } from '@o/gqless-react'
// export {
//   client as newClient,
//   query as newQuery,
//   generatedSchema,
// } from './graphql/new-generated'
export * as newGenerated from './graphql/new-generated'
export { client, query, schema, resetQueryCache } from './graphql'
export { mutation } from './graphql/mutation'
export { resolved, refetch, update, matchUpdate, preload } from '@o/gqless'
export * from './startLogging'
export * from './types'
export * from './types-extra'
export * from './helpers'
export * from './constants'
export * from './createFetcher'
export * from './graphql'
export * from './Auth'
