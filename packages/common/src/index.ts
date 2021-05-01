import * as Sentry from '@sentry/node'

// export common-web
// export * from '@dish/common-web'

Sentry.init({
  dsn: 'https://e87d54b2bd5c4bec9d82304e2d4b71d1@o600766.ingest.sentry.io/5744061',
  release: process.env.REACT_APP_COMMIT_HASH || process.env.COMMIT_HASH || 'unreleased',
  environment: process.env.DISH_ENV || 'development',
})

export const sentryMessage = (message: string, data?: any, tags?: { [key: string]: string }) => {
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureMessage(message)
  })
  console.log('Sent message to Sentry: ' + message)
}

export const sentryException = (error: Error, data?: any, tags?: { [key: string]: string }) => {
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
  let tagsString = ''
  try {
    tagsString = JSON.stringify(tags)
  } catch (err) {
    tagsString = `${tags}`
  }
  console.trace(`Error: ${error.message} (sentry)\n`, tagsString, error.stack)
}
