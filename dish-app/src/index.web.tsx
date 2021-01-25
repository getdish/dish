import './web/base.css'

import { startLogging } from '@dish/graph'
import { loadableReady } from '@loadable/component'
import React from 'react'
import { hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { isSSR } from './constants/constants'
import { Root } from './Root'

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

const IS_CONCURRENT = window.location.search.indexOf(`concurrent`) > -1
const ROOT = document.getElementById('root')

// register root component
AppRegistry.registerComponent('dish', () => Root)

async function start() {
  if (IS_CONCURRENT) {
    console.warn('👟 Concurrent Mode Running')
    // @ts-expect-error
    React.unstable_createRoot(ROOT).render(<Root />)
    return
  }

  if (process.env.NODE_ENV === 'production') {
    loadableReady(() => {
      hydrate(<Root />, ROOT)
    })
  } else {
    render(<Root />, ROOT)
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
