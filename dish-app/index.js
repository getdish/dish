import { registerRootComponent } from 'expo'
import { activateKeepAwake } from 'expo-keep-awake'

if (__DEV__) {
  activateKeepAwake()
}

try {
  const App = require('./shared/App').default

  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in the Expo client or in a native build,
  // the environment is set up appropriately
  registerRootComponent(App)
} catch (err) {
  console.error('Error running app:')
  console.error(err)
}
