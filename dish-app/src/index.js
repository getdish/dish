import { registerRootComponent } from 'expo'

try {
  const { Root } = require('./Root')

  // registerRootComponent calls AppRegistry.registerComponent('main', () => App);
  // It also ensures that whether you load the app in the Expo client or in a native build,
  // the environment is set up appropriately
  registerRootComponent(Root)
} catch (err) {
  console.error('Error running app:')
  console.error(err)
}
