if (process.env.TARGET === 'node' || process.env.NODE_ENV === 'test') {
  const { LocalStorage } = require('node-localstorage')
  global['localStorage'] = new LocalStorage('./tmp')
}
