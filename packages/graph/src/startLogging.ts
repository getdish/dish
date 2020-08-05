import { client } from './graphql'

let isLogging = false

export function startLogging(verbose = false) {
  // dont import outside node, it accesses window
  if (process.env.NODE_ENV !== 'production') {
    if (isLogging) return
    isLogging = true
    const { Logger } = require('@gqless/logger')
    new Logger(client, verbose)
  }
}
