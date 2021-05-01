// only imported by native app!
// for web just skip to src/index

import '@dish/helpers/polyfill'
import 'expo-asset'

import * as Sentry from '@sentry/react-native'
import { registerRootComponent } from 'expo'

Sentry.init({
  dsn: 'https://e87d54b2bd5c4bec9d82304e2d4b71d1@o600766.ingest.sentry.io/5744061',
  release: process.env.REACT_APP_COMMIT_HASH || process.env.COMMIT_HASH || 'unreleased',
  environment: process.env.DISH_ENV || 'development',
})

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
  console.log('🥾')
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
