window['requestIdleCallback'] = window['requestIdleCallback'] || setTimeout
window['ResizeObserver'] = require('resize-observer-polyfill').default
require('array-flat-polyfill')

console.log('hi legacy browser')
