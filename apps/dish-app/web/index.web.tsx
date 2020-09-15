import './base.css'
import './bootstrapEnv'

import { sleep } from '@dish/async'
import { startLogging } from '@dish/graph'
import { createOvermind } from 'overmind'
import React from 'react'
// @ts-ignore
import { createRoot, hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { App } from '../shared/App'
import { OVERMIND_MUTATIONS, isWorker } from '../shared/constants'
import { config, om } from '../shared/state/om'

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

// register root component
AppRegistry.registerComponent('dish', () => App)

// exports
if (process.env.TARGET === 'ssr') {
  exports.App = require('../shared/App').App
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')
const search = window.location.search

async function start() {
  // can render splash here

  let done = false
  await Promise.race([
    om.initialized,
    sleep(1000).then(() => {
      if (!done) {
        console.warn('\n\n\nOM TIMED OUT!!!\n\n\n')
      }
    }),
  ])
  done = true

  if (OVERMIND_MUTATIONS) {
    hydrate(<App overmind={om} />, document.getElementById('root'))
  } else {
    // for worker
    if (isWorker) {
      rootEl = document.createElement('div')
      document.body.appendChild(rootEl)
    }

    if (search.indexOf(`concurrent`) > -1) {
      console.warn('👟 Concurrent Mode Running')
      createRoot(rootEl).render(<App overmind={om} />)
    } else {
      render(<App overmind={om} />, rootEl)
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module?.hot?.accept()
  // @ts-ignore
  module?.hot?.accept('../shared/state/om')
}

// can remove this started check once overmind works better for hmr
if (!window['STARTED'] && process.env.TARGET !== 'ssr') {
  start()
  window['STARTED'] = true
}
