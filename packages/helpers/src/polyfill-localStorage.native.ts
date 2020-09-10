if (typeof localStorage === 'undefined') {
  global['localStorage'] = require('react-native-sync-localstorage')
}
