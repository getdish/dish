import 'expo-dev-client';
// only imported by native app!
// for web just skip to src/index
// import '@dish/helpers/polyfill'
// import 'expo-asset'
// import * as Sentry from '@sentry/react-native'
import { AppRegistry } from 'react-native'

// stupid fucking thing doesnt uninstall even w this
// LogBox.uninstall()
// delete console.warn
// NOTE this is because I CANNOT UNSINSTALL the console.warn shim and it adds a massive uncessary stack trace to everything
// plus expo splash screen throwing huge console warn that seems unfixed for now
// https://github.com/expo/expo/issues/14824
// leads to madness, so best i can do is this...
// console.warn = (...args) => console.table({ '⛔️': args })
// // LogBox.ignoreAllLogs(true)
// LogBox.ignoreLogs([
//   "No native splash screen registered for given view controller. Call 'SplashScreen.show' for given view controller first.",
//   /^\(ADVICE\).*/g,
// ])
// Location.installWebGeolocationPolyfill()

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     dsn: process.env.SENTRY_URL || console.error('no sentry url'),
//     release: process.env.GIT_COMMIT || 'unreleased',
//     environment: process.env.NODE_ENV || 'development',
//   })
// } else {
//   console.log('NODE_ENV', process.env.NODE_ENV)
// }

console.log('loading')

// if (process.env.NODE_ENV === 'development') {
//   require('@dish/graph').startLogging()
// }

// navigator.geolocation = require('@react-native-community/geolocation')

// import './src/test'

try {
  
  // const { View } = require('react-native')
  // // eslint-disable-next-line react/react-in-jsx-scope
  // const Root = () => <View style={{ width: 100, height: 100, backgroundColor: 'red' }} />
  
  const { Root } = require('./src/Root')
  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in the Expo client or in a native build,
  // the environment is set up appropriately
  AppRegistry.registerComponent('main', () => Root)
} catch (err) {
  console.error('Error running app:')
  console.error(err.message)
  console.error(err.stack)
}
