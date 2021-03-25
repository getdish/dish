export const requestIdleCallback = function (cb) {
  if (window.requestIdleCallback) return window.requestIdleCallback(cb)
  var start = Date.now()
  return setTimeout(function () {
    cb({
      didTimeout: false,
      timeRemaining: function () {
        return Math.max(0, 50 - (Date.now() - start))
      },
    })
  }, 1)
}

export const cancelIdleCallback = function (id) {
  if (window.cancelIdleCallback) return window.cancelIdleCallback(id)
  return clearTimeout(id)
}
