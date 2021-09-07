import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'

const release =
  process.env.REACT_APP_COMMIT_HASH ||
  process.env.COMMIT_HASH ||
  process.env.npm_package_version ||
  'unreleased'

Sentry.init({
  dsn: 'https://e87d54b2bd5c4bec9d82304e2d4b71d1@o600766.ingest.sentry.io/5744061',
  release,
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.NODE_ENV || 'development',
})
