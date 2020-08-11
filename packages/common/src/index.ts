// TODO: How to make this conditional on being in Node without using async?
// Async prevents ENV being loaded *before* the rest of the code.
import './load_env'

import * as Sentry from '@sentry/node'

// export common-web
// export * from '@dish/common-web'

Sentry.init({
  dsn: 'https://af86c8f6e90e4afe8f5d1a13ab8e9279@sentry.k8s.dishapp.com/2',
  release:
    process.env.REACT_APP_COMMIT_HASH ||
    process.env.COMMIT_HASH ||
    'unreleased',
  environment: process.env.DISH_ENV || 'development',
})

export const sentryMessage = (
  message: string,
  data?: any,
  tags?: { [key: string]: string }
) => {
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureMessage(message)
  })
  console.log('Sent message to Sentry: ' + message)
}

export const sentryException = (
  error: Error,
  data?: any,
  tags?: { [key: string]: string }
) => {
  if (process.env.DISH_ENV != 'production') {
    console.error(error)
    return
  }
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureException(error)
  })
  console.log('Sent exception to Sentry: ' + error.message)
}
