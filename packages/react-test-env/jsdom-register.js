const KEYS = require('jsdom-global/keys')
require('./_/index')

const { JSDOM } = require('jsdom')
const url = 'http://d1live.com/'
// fake a browser!
const document = new JSDOM(``, {
  pretendToBeVisual: true,
  url: url,
  referrer: url,
  contentType: 'text/html',
})

const window = document.window

KEYS.forEach(function (key) {
  global[key] = window[key]
})

global['document'] = window.document
global['window'] = window
global['MessageChannel'] = require('worker_threads').MessageChannel
window.console = global.console

global['MutationObserver'] = global['window']['MutationObserver']
