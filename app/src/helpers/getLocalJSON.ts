import { crossLocalStorage } from 'cross-local-storage'

export const getLocalJSON = async (key: string, defaultValue?: any) => {
  const item = await crossLocalStorage.getItem(key as never)
  if (item) {
    try {
      return JSON.parse(item)
    } catch (err) {
      console.warn('Invalid storage value', err)
      await crossLocalStorage.removeItem(key as never)
      return defaultValue
    }
  }
  return defaultValue
}

export const setLocalJSON = async (key: string, value: any) => {
  await crossLocalStorage.setItem(key as never, JSON.stringify(value))
}
