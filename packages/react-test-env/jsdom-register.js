require('jsdom-global/register')
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
Object.keys(jsdom.window).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = jsdom.window[key]
  }
})
