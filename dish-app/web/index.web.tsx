// import '../test.tsx'
// import './whydidyourender'
import './base.css'
import './globals'

import { sleep } from '@dish/async'
import { startLogging } from '@dish/graph'
import React from 'react'
// @ts-ignore
import ReactDOM, { hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import { isSSR } from '../shared/constants'
import { OVERMIND_MUTATIONS } from '../shared/overmindMutations'
import { config, om } from '../shared/state/om'
import { Root } from './Root'

if (isSSR) {
  console.log('Patching useLayoutEffect to avoid many warnings in server mode')
  React.useLayoutEffect = React.useEffect
}

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

const IS_CONCURRENT = window.location.search.indexOf(`concurrent`) > -1
const ROOT = document.getElementById('root')

// register root component
AppRegistry.registerComponent('dish', () => Root)

async function start() {
  await startOvermind()

  if (IS_CONCURRENT) {
    console.warn('👟 Concurrent Mode Running')
    // @ts-expect-error
    React.unstable_createRoot(ROOT).render(<Root overmind={om} />)
    return
  }

  render(<Root overmind={om} />, ROOT)
}

// SSR exports
if (process.env.TARGET === 'ssr') {
  exports.App = Root
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}

async function startOvermind() {
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
  }
}

if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error
  module?.hot?.accept()
}

if (!window['STARTED'] && process.env.TARGET !== 'ssr') {
  start()
  window['STARTED'] = true
}
