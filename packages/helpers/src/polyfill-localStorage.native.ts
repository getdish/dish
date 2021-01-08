import localStorage from 'react-native-sync-localstorage'

console.log('polyfilling localStorage', global.localStorage)

if (typeof global.localStorage === 'undefined') {
  global.localStorage = require('react-native-sync-localstorage')
}

localStorage.getAllFromLocalStorage()
