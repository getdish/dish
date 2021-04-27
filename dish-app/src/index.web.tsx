import './web/base.css'

import { startLogging } from '@dish/graph'
import { loadableReady } from '@loadable/component'
import React from 'react'
import ReactDOM, { hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { isSSR } from './constants/constants'
import { Root } from './Root'

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

const IS_NOT_CONCURRENT = window.location.search.indexOf(`not-concurrent`) > -1
const ROOT = document.getElementById('root')!

// register root component
AppRegistry.registerComponent('dish', () => Root)

async function start() {
  if (IS_NOT_CONCURRENT) {
    render(<Root />, ROOT)
    return
  }

  // disable as we're not doing SSR for now
  if (false && process.env.NODE_ENV === 'production') {
    loadableReady(() => {
      hydrate(<Root />, ROOT)
    })
  } else {
    render(<Root />, ROOT)
    // console.warn('👟 Concurrent Mode')
    // require('react-dom').unstable_createRoot(ROOT).render(<Root />)
  }
}

// SSR exports
if (isSSR) {
  exports.App = Root
  exports.ReactDOMServer = require('react-dom/server')
}

if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error
  module?.hot?.accept()
}

if (!window['STARTED'] && process.env.TARGET !== 'node') {
  start()
  window['STARTED'] = true
}
