import 'mutationobserver-polyfill'
// import { LocalStorage } from 'node-localstorage'
import React from 'react'
import ReactDOM from 'react-dom'

export { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react'

export { default as TestRenderer, act } from 'react-test-renderer'

// globalThis.localStorage = new LocalStorage('./tmp')

globalThis['React'] = React
globalThis['ReactDOM'] = ReactDOM

if (process.env.DEBUG) {
  const debugHttp = require('debug-http')
  debugHttp()
}
