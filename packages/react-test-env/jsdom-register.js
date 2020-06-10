// require('jsdom-global/register')
require('./_/index')

const { JSDOM } = require('jsdom')
const url = 'http://d1sh_hasura_live.com:19006/'
// fake a browser!
const jsdom = new JSDOM(``, {
  pretendToBeVisual: true,
  url: url,
  referrer: url,
  contentType: 'text/html',
})

global['window'] = jsdom.window

const win = global['window']
Object.keys(win).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = win[key]
  }
})

global['MutationObserver'] = global['window']['MutationObserver']
