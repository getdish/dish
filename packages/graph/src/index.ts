import 'isomorphic-unfetch'

export { graphql } from '@gqless/react'
export { client, query, schema } from './graphql'
export { mutation } from './graphql/mutation'
export { resolved } from 'gqless'
export * from './startLogging'
export * from './types'
export * from './types-extra'
export * from './helpers'
export * from './constants'

if (process.env.TARGET !== 'client') {
  process.on('unhandledRejection', (error) => {
    console.log('Hopefully you see this log message and not an uncaught error')
  })
}
