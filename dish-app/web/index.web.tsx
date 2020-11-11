import './whydidyourender'
import './start'
import './base.css'
import './bootstrapEnv'

import { startLogging } from '@dish/graph'
import { sleep } from '@o/async'
import React from 'react'
// @ts-ignore
import { createRoot, hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { OVERMIND_MUTATIONS, isWorker } from '../shared/constants'
import { config, om } from '../shared/state/om'
import { Root } from './Root'

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

// register root component
AppRegistry.registerComponent('dish', () => Root)

// exports
if (process.env.TARGET === 'ssr') {
  exports.App = Root
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')
const search = window.location.search

async function start() {
  // can render splash here

  let done = false
  await Promise.race([
    om.initialized.then(() => {
      done = true
    }),
    sleep(5000),
  ])
  if (!done) {
    console.error('OM TIMED OUT')
  }

  if (OVERMIND_MUTATIONS) {
    hydrate(<Root overmind={om} />, document.getElementById('root'))
  } else {
    // for worker
    if (isWorker) {
      rootEl = document.createElement('div')
      document.body.appendChild(rootEl)
    }

    if (search.indexOf(`concurrent`) > -1) {
      console.warn('👟 Concurrent Mode Running')
      createRoot(rootEl).render(<Root overmind={om} />)
    } else {
      render(<Root overmind={om} />, rootEl)
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
