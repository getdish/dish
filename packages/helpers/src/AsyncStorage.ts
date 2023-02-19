// export { default as AsyncStorage } from '@react-native-async-storage/async-storage'

// import localStorage from 'react-native-sync-localstorage'

// if (typeof global.localStorage === 'undefined') {
//   global.localStorage = require('react-native-sync-localstorage')
// }

// localStorage.getAllFromLocalStorage()

// cant use chrome devotools anmoyer

// import { MMKV } from 'react-native-mmkv'

// export const storage = new MMKV({
//   id: 'localstorage',
// })

// globalThis.localStorage = {
//   getItem: (key: string) => storage.getString(key) ?? null,
//   setItem: (key: string, value) => storage.set(key, value),
//   clear: () => storage.clearAll(),
//   removeItem: (key: string) => storage.delete(key),
//   key: (index) => storage.getAllKeys()[index],
//   get length() {
//     return storage.getAllKeys().length
//   },
// }
