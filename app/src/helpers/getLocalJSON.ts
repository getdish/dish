import AsyncStorage from '@react-native-async-storage/async-storage'

export const getLocalJSON = async (key: string, defaultValue?: any) => {
  const item = await AsyncStorage.getItem(key)
  if (item) {
    try {
      return JSON.parse(item)
    } catch (err) {
      console.warn('Invalid storage value', err)
      await AsyncStorage.removeItem(key)
      return defaultValue
    }
  }
  return defaultValue
}

export const setLocalJSON = async (key: string, value: any) => {
  await AsyncStorage.setItem(key, JSON.stringify(value))
}
