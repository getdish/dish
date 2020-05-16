// TODO: How to make this conditional on being in Node without using async?
// Async prevents ENV being loaded *before* the rest of the code.
import './load_env'

import * as Sentry from '@sentry/node'

// export common-web
// export * from '@dish/common-web'

Sentry.init({
  dsn: 'https://2246891d480e4584a0d1fe1c1c09df7b@sentry.k8s.dishapp.com/2',
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
  console.log('Sending message to Sentry: ' + message)
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureMessage(message)
  })
}

export const sentryException = (
  error: Error,
  data?: any,
  tags?: { [key: string]: string }
) => {
  console.log('Sending exception to Sentry: ' + error.message)
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureException(error)
  })
}
