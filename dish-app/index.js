// only imported by native app!
// for web just skip to src/index

import '@dish/helpers/polyfill'
import 'expo-asset'

import { registerRootComponent } from 'expo'

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
