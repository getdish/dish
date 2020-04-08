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

const { OVERMIND_MUTATIONS, isWorker } = require('../shared/constants')
const { App } = require('../shared/views/App')

// register root component
AppRegistry.registerComponent('dish', () => App)

window['React'] = React

// exports
if (process.env.TARGET === 'ssr') {
  exports.App = require('../shared/views/App')
  exports.config = require('../shared/state/om')
}
if (process.env.TARGET !== 'worker') {
  exports.Helmet = require('react-helmet')
}
if (process.env.TARGET !== 'preact') {
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')

// needs to be above App next to render()
const om = createOvermind(config, {
  devtools: 'localhost:3031',
  logProxies: true,
  hotReloading: true,
})

async function start() {
  if (!isWorker) {
    require('./mapkit')
    await startMapKit()
    console.log('started mapkit')
  }

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
