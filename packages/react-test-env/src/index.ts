import 'jsdom-global/register'
import 'mutationobserver-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

export { default as TestRenderer, act } from 'react-test-renderer'

global['React'] = React
global['ReactDOM'] = ReactDOM
Object.keys(global['window']).forEach((key) => {
  if (typeof global[key] === 'undefined') {
    global[key] = global['window'][key]
  }
})

if (process.env.DEBUG) {
  const debugHttp = require('debug-http')
  debugHttp()
}
