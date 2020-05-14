module.exports = new Proxy(
  {},
  {
    get(target, key) {
      return window['mapkit'][key]
    },
    set(target, key, val) {
      window['mapkit'][key] = val
      return true
    },
  }
)
