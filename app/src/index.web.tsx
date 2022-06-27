// import './whydidyourender'
import { Root } from './Root'
import './web/base.css'
import { startLogging } from '@dish/graph'
import '@tamagui/core/reset.css'
import React from 'react'
import { render } from 'react-dom'
import { AppRegistry } from 'react-native'

if (process.env.NODE_ENV === 'development') {
  startLogging()
}

const FORCE_NOT_CONCURRENT = window.location.search.indexOf(`not-concurrent`) > -1
const ROOT = document.getElementById('root')!

// register root component
AppRegistry.registerComponent('dish', () => Root)

async function main() {
  if (FORCE_NOT_CONCURRENT) {
    render(<Root />, ROOT)
    return
  }
  // disable as we're not doing SSR for now
  // if (false && process.env.NODE_ENV === 'production') {
  //   loadableReady(() => {
  //     hydrate(<Root />, ROOT)
  //   })
  //   return
  // }
  // createRoot(ROOT).render(<Root />)
  render(<Root />, ROOT)
}

// SSR exports
if (process.env.IS_SSR_RENDERING || process.env.TARGET === 'ssr') {
  exports.App = Root
  exports.ReactDOMServer = require('react-dom/server')
}

if (process.env.NODE_ENV === 'development') {
  // @ts-expect-error
  module?.hot?.accept()
}

if (!window['__ignore_hmr'] && process.env.TARGET !== 'node') {
  main()
  window['__ignore_hmr'] = true
}
