import { isSafari } from '@dish/helpers'

import { client } from './graphql'

let isLogging = false

export function startLogging(verbose = false) {
  if (window['__started_logging']) {
    return
  }
  window['__started_logging'] = true
  // dont import outside node, it accesses window
  if (process.env.NODE_ENV !== 'production') {
    if (isLogging) return
    isLogging = true

    // disbale react native prettier dep uses named capture groups which breaks hermes
    if (process.env.TARGET === 'web') {
      // if (!isSafari) {
      //   console.log('Disable gqty logging as it doesnt collapse')
      // } else {
      import('@gqty/logger').then((gqtyLogger) => {
        if (!gqtyLogger?.createLogger) {
          console.log('no logger', gqtyLogger)
          return
        }
        const Logger = gqtyLogger.createLogger(client, { stringifyJSON: false })
        Logger.start()
      })
      // }
    }
  }
}
