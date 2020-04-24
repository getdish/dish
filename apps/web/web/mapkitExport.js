module.exports = new Proxy(
  {},
  {
    get(target, key) {
      return window['mapkit'][key]
    },
    set(target, key, val) {
      window['marpkit'][key] = val
      return true
    },
  }
)
