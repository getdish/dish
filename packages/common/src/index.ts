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

export const sentryException = ({
  error,
  data,
  tags,
  logger = process.env.DISH_ENV != 'production' ? console.error : console.trace,
}: {
  error: Error
  data?: any
  tags?: { [key: string]: string }
  logger?: (...args: any[]) => void
}) => {
  if (process.env.DISH_ENV != 'production') {
    logger(error)
    return
  }
  Sentry.withScope((scope) => {
    if (tags) {
      scope.setTags(tags)
    }
    scope.setExtras(data)
    Sentry.captureException(error)
  })
  logger(`Error: ${error.message} (sentry)\n`, str(tags), str(data), error.stack)
}

const str = (x: any) => {
  try {
    return JSON.stringify(x)
  } catch {
    return `${x}`
  }
}
