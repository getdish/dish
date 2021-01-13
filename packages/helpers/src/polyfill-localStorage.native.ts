import localStorage from 'react-native-sync-localstorage'

if (typeof global.localStorage === 'undefined') {
  global.localStorage = require('react-native-sync-localstorage')
}

localStorage.getAllFromLocalStorage()
