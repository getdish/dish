// TODO: How to make this conditional on being in Node without using async?
// Async prevents ENV being loaded *before* the rest of the code.
import './load_env'

import * as Sentry from '@sentry/node'

// export common-web
// export * from '@dish/common-web'

Sentry.init({
  dsn:
    'https://453762dd4e3b4aa1bdad5154ef1e0acb@o1.ingest.sentry.k8s.dishapp.com/2',
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
