if (process.env.TARGET === 'node' || process.env.NODE_ENV === 'test') {
  console.log('polyfill localStorage node')
  const { LocalStorage } = require('node-localstorage')
  global['localStorage'] = new LocalStorage('./tmp')
}
