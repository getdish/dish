export const getLocalJSON = (key: string, defaultValue?: any) => {
  const item = localStorage.getItem(key)
  if (item) {
    try {
      return JSON.parse(item)
    } catch (err) {
      console.warn('Invalid storage value', err)
      localStorage.removeItem(key)
      return defaultValue
    }
  }
  return defaultValue
}

export const setLocalJSON = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}
