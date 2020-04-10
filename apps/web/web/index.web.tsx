//
// NOTE: nothing should import this file! its the root!
//

import { createOvermind } from 'overmind'
import { AppRegistry } from 'react-native'

import { config } from '../shared/state/om'

// global styles
require('./base.css')
const React = require('react')
const { hydrate, render } = require('react-dom')

require('./bootstrapEnv')

const {
  OVERMIND_MUTATIONS,
  isWorker,
  isSSR,
  isPreact,
} = require('../shared/constants')
const { App } = require('../shared/views/App')

// register root component
AppRegistry.registerComponent('dish', () => App)

window['React'] = React

// exports
if (isSSR) {
  exports.App = require('../shared/views/App').App
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}
if (!isWorker) {
  exports.Helmet = require('react-helmet')
}

let rootEl = document.getElementById('root')

async function start() {
  if (!isWorker) {
    require('./mapkit')
    await startMapKit()
    console.log('started mapkit')
  }

  const om = createOvermind(config, {
    devtools: 'localhost:3031',
    logProxies: true,
    hotReloading: true,
  })

  // can render splash here

  await om.initialized

  window['om'] = om

  if (OVERMIND_MUTATIONS) {
    hydrate(<App overmind={om} />, document.getElementById('root'))
  } else {
    // for worker
    if (isWorker) {
      rootEl = document.createElement('div')
      document.body.appendChild(rootEl)
    }
    render(<App overmind={om} />, rootEl)
  }
}

if (!window['IS_SSR_RENDERING'] && !window['STARTED']) {
  window['STARTED'] = true
  console.log('Starting from index')
  start()
}

async function startMapKit() {
  const token = `eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkwzQ1RLNTYzUlQifQ.eyJpYXQiOjE1ODQ0MDU5MzYuMjAxLCJpc3MiOiIzOTlXWThYOUhZIn0.wAw2qtwuJkcL6T6aI-nLZlVuwJZnlCNg2em6V1uopx9hkUgWZE1ISAWePMoRttzH_NPOem4mQfrpmSTRCkh2bg`
  // init mapkit
  // @ts-ignore
  mapkit.init({
    authorizationCallback: (done) => {
      done(token)
    },
  })
}

if (module['hot']) {
  module['hot'].accept('../shared/state/om', () => {
    console.log('hmr state')
  })
}
