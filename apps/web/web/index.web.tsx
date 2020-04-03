import { AppRegistry } from 'react-native'

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
exports.App = require('../shared/views/App')
exports.config = require('../shared/state/om')
if (process.env.TARGET !== 'worker') {
  exports.Helmet = require('react-helmet')
}
if (process.env.TARGET !== 'preact') {
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')

async function start() {
  if (!isWorker) {
    require('./mapkit')
    await startMapKit()
    console.log('started mapkit')
  }

  if (OVERMIND_MUTATIONS) {
    hydrate(<App />, document.getElementById('root'))
  } else {
    // for worker
    if (isWorker) {
      rootEl = document.createElement('div')
      document.body.appendChild(rootEl)
    }
    render(<App />, rootEl)
  }
}

if (!window['IS_SSR_RENDERING']) {
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
