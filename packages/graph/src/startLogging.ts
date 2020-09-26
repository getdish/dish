import { isSafari } from '@dish/helpers'

import { client } from './graphql'

let isLogging = false

export function startLogging(verbose = false) {
  // dont import outside node, it accesses window
  if (process.env.NODE_ENV !== 'production') {
    if (isLogging) return
    isLogging = true
    if (!isSafari) {
      const { Logger } = require('@o/gqless-logger')
      new Logger(client, verbose)
    }
  }
}
