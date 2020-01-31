import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: 'https://2246891d480e4584a0d1fe1c1c09df7b@sentry.k8s.dishapp.com/2',
})

console.log('Sentry initialised')
