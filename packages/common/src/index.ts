import * as Sentry from '@sentry/node'

// export common-web
// export * from '@dish/common-web'

Sentry.init({
  dsn: 'https://1aee4aedff484d8a9d6c71439693321e@o968082.ingest.sentry.io/5919483',
  release: process.env.REACT_APP_COMMIT_HASH || process.env.COMMIT_HASH || 'unreleased',
  environment: process.env.DISH_ENV || 'development',
})

const defaultLogger = process.env.DISH_ENV != 'production' ? console.error : console.trace

export const sentryMessage = (
  message: string,
  {
    data,
    tags,
    logger = defaultLogger,
  }: {
    data?: any
    tags?: { [key: string]: string }
    logger?: (...args: any[]) => void
  } = {}
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
  {
    data,
    tags,
    logger = defaultLogger,
  }: {
    data?: any
    tags?: { [key: string]: string }
    logger?: (...args: any[]) => void
  } = {}
) => {
  if (process.env.DISH_ENV != 'production') {
    console.log("Sentry caught exception: ")
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
