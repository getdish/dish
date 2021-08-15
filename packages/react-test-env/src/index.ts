import 'mutationobserver-polyfill'

import { LocalStorage } from 'node-localstorage'
import React from 'react'
import ReactDOM from 'react-dom'

export { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react'

export { default as TestRenderer, act } from 'react-test-renderer'

globalThis.localStorage = new LocalStorage('./tmp')

globalThis['React'] = React
globalThis['ReactDOM'] = ReactDOM

if (process.env.DEBUG) {
  const debugHttp = require('debug-http')
  debugHttp()
}

if (process.env.NODE_ENV === 'test') {
  // warning: wrapping console in ci mode to suppress react 18 errors until testing library fixes
  const og = console.error.bind(console)
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported in React 18.')
    ) {
      return
    }
    og(...args)
  }
}
