let isLoaded = false
const loadedCallbacks = new Set<Function>()

export const setMapIsLoaded = () => {
  isLoaded = true
  loadedCallbacks.forEach((cb) => cb())
}

export const onMapLoadedCallback = (cb: Function) => {
  if (isLoaded) cb()
  loadedCallbacks.add(cb)
  return () => {
    loadedCallbacks.delete(cb)
  }
}
