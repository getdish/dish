// only imported by native app!
// for web just skip to src/index

import '@dish/helpers/polyfill'
import '@expo/match-media'

import { registerRootComponent } from 'expo'

console.log('what is match', window.matchMedia)

// import { activateKeepAwake } from 'expo-keep-awake'

// if (__DEV__) {
//   activateKeepAwake()
// }

try {
  console.log('loading app')
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
