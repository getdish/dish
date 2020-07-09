import './base.css'
import './bootstrapEnv'

import { client, mutation, query, schema, startLogging } from '@dish/graph'
import { createOvermind } from 'overmind'
import React from 'react'
// @ts-ignore
import { createRoot, hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { App } from '../shared/App'
import { OVERMIND_MUTATIONS, isWorker } from '../shared/constants'
import { config } from '../shared/state/om'

// non-invasive test for closure compiler + fixed rollup-tscc
// import { importable } from './xy'
// console.log(importable(1 + 1))

//
// NOTE: import order is important here DONT USE `import`
//       add require to the part that says "import here"
// NOTE: i undid the "no import" thing temporarily for tscc
// NOTE: nothing should import this file! its the root!
//

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

// register root component
AppRegistry.registerComponent('dish', () => App)

window['React'] = React
window['gqless'] = {
  query,
  mutation,
  schema,
  client,
}

// exports
if (process.env.TARGET === 'ssr') {
  exports.App = require('../shared/views/App').App
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')
const search = window.location.search

async function start() {
  console.log('starting...')
  const om = createOvermind(config, {
    devtools: process.env.NODE_ENV === 'production' ? false : `localhost:3031`,
    logProxies: true,
    hotReloading: process.env.NODE_ENV !== 'production',
  })
  window['om'] = om

  // can render splash here

  await om.initialized

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
