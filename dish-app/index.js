// only imported by native app!
// for web just skip to src/index

import '@dish/helpers/polyfill'
import 'expo-asset'
import '@formatjs/intl-relativetimeformat/polyfill'
import '@formatjs/intl-datetimeformat/polyfill'
import '@formatjs/intl-datetimeformat/locale-data/en'

import { registerRootComponent } from 'expo'

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
