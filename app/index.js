// import 'expo-dev-client';
// only imported by native app!
// for web just skip to src/index
import '@dish/helpers/polyfill'
import 'expo-asset'
// import * as Sentry from '@sentry/react-native'
import { AppRegistry } from 'react-native'

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: process.env.SENTRY_URL || console.error('no sentry url'),
//     release: process.env.GIT_COMMIT || 'unreleased',
//     environment: process.env.NODE_ENV || 'development',
//   })
// } else {
//   console.log('NODE_ENV', process.env.NODE_ENV)
// }

if (process.env.NODE_ENV === 'development') {
  require('@dish/graph').startLogging()
}

navigator.geolocation = require('@react-native-community/geolocation')

try {
  const { Root } = require('./src/Root')
  // prettier-ignore
  console.log('🥾 boot', process.env.SENTRY_URL, process.env.NODE_ENV, process.env.DISH_ENV, Root)
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in the Expo client or in a native build,
  // the environment is set up appropriately
  AppRegistry.registerComponent('main', () => Root)
} catch (err) {
  console.error('Error running app:')
  console.error(err.message)
  console.error(err.stack)
}
