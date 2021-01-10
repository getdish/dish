import localStorage from 'react-native-sync-localstorage'

console.log('polyfill localStorage native')

if (typeof global.localStorage === 'undefined') {
  global.localStorage = require('react-native-sync-localstorage')
}

localStorage.getAllFromLocalStorage()
