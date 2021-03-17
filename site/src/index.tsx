import './assets/font-gteesti/stylesheet.css'
import './assets/siteBase.css'

window.requestIdleCallback = window.requestIdleCallback || setTimeout

if (process.env.NODE_ENV === 'development') {
  require('./installDevHelpers')
}

// import './assets/font-colfax/stylesheet.css'
async function start() {
  let polyfills = []

  // polyfills
  if (!Array.prototype.flatMap) {
    polyfills.push(import('array-flat-polyfill'))
  }
  if (!window['IntersectionObserver']) {
    polyfills.push(import('intersection-observer'))
  }
  if (!window['ResizeObserver']) {
    polyfills.push(async () => {
      window['ResizeObserver'] = (
        await import('resize-observer-polyfill')
      ).default
    })
  }

  await Promise.all(polyfills.map((x) => x()))

  let unloaded = false
  window.addEventListener('beforeunload', () => {
    console.log('unloading')
    unloaded = true
  })
  const og = window.requestAnimationFrame
  window.requestAnimationFrame = (cb) => {
    if (!unloaded) {
      return og(cb)
    }
  }

  require('./configurations')
  require('./startSite')
}

start()

process.env.NODE_ENV === 'development' &&
  module['hot'] &&
  module['hot'].accept()
