if (process.env.TARGET === 'node') {
  const { LocalStorage } = require('node-localstorage')
  global['localStorage'] = new LocalStorage('./tmp')
}
