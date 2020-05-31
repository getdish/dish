import 'mutationobserver-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

export { default as TestRenderer, act } from 'react-test-renderer'

global['React'] = React
global['ReactDOM'] = ReactDOM

if (process.env.DEBUG) {
  const debugHttp = require('debug-http')
  debugHttp()
}
