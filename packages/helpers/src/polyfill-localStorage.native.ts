import localStorage from 'react-native-sync-localstorage'

if (typeof localStorage === 'undefined') {
  global['localStorage'] = require('react-native-sync-localstorage')
}

localStorage.getAllFromLocalStorage()
