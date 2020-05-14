function getMapkitProxy() {
  const getMapkit = () => window['mapkit'] ?? {}

  return new Proxy(
    {},
    {
      get(target, key) {
        return getMapkit()[key]
      },
      set(target, key, val) {
        getMapkit()[key] = val
        return true
      },
    }
  )
}

module.exports = getMapkitProxy()
