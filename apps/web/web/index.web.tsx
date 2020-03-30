// global styles
import './base.css'
import './mapkit'

import React from 'react'
import { hydrate, render } from 'react-dom'
import * as ReactDOMServerExport from 'react-dom/server'

import { OVERMIND_MUTATIONS } from '../shared/constants'
import { App } from '../shared/views/App'

window['React'] = React

// exports
export { Helmet } from 'react-helmet'
export { App } from '../shared/views/App'
export { config } from '../shared/state/om'
export const ReactDOMServer = ReactDOMServerExport

async function start() {
  await startMapKit()

  if (OVERMIND_MUTATIONS) {
    hydrate(<App />, document.getElementById('root'))
  } else {
    render(<App />, document.getElementById('root'))
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
