// global styles
require('./base.css')
const React = require('react')
const { hydrate, render } = require('react-dom')

if (process.env.TARGET == 'worker') {
  window['isWorker'] = true
  // @ts-ignore
  document.head = {
    appendChild() {},
    insertBefore() {},
  }
  // @ts-ignore
  document.cookie = ''
  // @ts-ignore
  window.history = window.history || {
    pathname: '/',
    location: null,
    replaceState() {},
    pushState() {},
  }
}

if (process.env.TARGET == 'preact') {
  require('preact/debug')
  React['__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'] = {
    ReactCurrentOwner: {
      get current() {
        return {
          elementType: {
            componentId: '',
          },
        }
      },
    },
  }
} else {
  exports.ReactDOMServer = require('react-dom/server')
}

const { OVERMIND_MUTATIONS, isWorker } = require('../shared/constants')
const { App } = require('../shared/views/App')

window['React'] = React

// exports
exports.Helmet = require('react-helmet')
exports.App = require('../shared/views/App')
exports.config = require('../shared/state/om')

// export const

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
