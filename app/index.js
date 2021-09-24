// only imported by native app!
// for web just skip to src/index

import 'expo-asset'
import '@dish/helpers/polyfill'

import * as Sentry from '@sentry/react-native'
import { registerRootComponent } from 'expo'

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.SENTRY_URL || console.error('no sentry url'),
    release: process.env.GIT_COMMIT || 'unreleased',
    environment: process.env.NODE_ENV || 'development',
  })
} else {
  console.log('NODE_ENV', process.env.NODE_ENV)
}

if (process.env.NODE_ENV === 'development') {
  require('@dish/graph').startLogging()
}

navigator.geolocation = require('@react-native-community/geolocation')

// console.log('polyfill..........')
// require('@formatjs/intl-getcanonicallocales/polyfill')
// require('@formatjs/intl-locale/polyfill')
// require('@formatjs/intl-numberformat/polyfill')
// require('@formatjs/intl-displaynames/polyfill')
// require('@formatjs/intl-displaynames/locale-data/en')
// require('@formatjs/intl-pluralrules/polyfill')
// require('@formatjs/intl-pluralrules/locale-data/en')
// require('@formatjs/intl-datetimeformat/polyfill')
// require('@formatjs/intl-datetimeformat/locale-data/en')
// require('@formatjs/intl-relativetimeformat/polyfill')
// require('@formatjs/intl-relativetimeformat/locale-data/en')

// import { activateKeepAwake } from 'expo-keep-awake'

// if (__DEV__) {
//   activateKeepAwake()
// }

try {
  console.log('🥾 boot', process.env.SENTRY_URL, process.env.NODE_ENV, process.env.DISH_ENV)
  const { Root } = require('./src/Root')
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in the Expo client or in a native build,
  // the environment is set up appropriately
  registerRootComponent(Root)
} catch (err) {
  console.error('Error running app:')
  console.error(err.message)
  console.error(err.stack)
}
