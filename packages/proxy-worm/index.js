module.exports = proxyWorm()

function proxyWorm() {
  return new Proxy(
    {
      __isProxyWorm__: true,
      StyleSheet: {
        create() {},
      },
    },
    {
      get(target, key) {
        return Reflect.get(target, key) || proxyWorm()
      },
      apply() {
        return proxyWorm()
      },
    }
  )
}
