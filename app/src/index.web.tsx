// import './whydidyourender'
import { Root } from './Root'
import './web/base.css'
import { startLogging } from '@dish/graph'
import '@tamagui/core/reset.css'
import React, { StrictMode } from 'react'
import { render } from 'react-dom'
import { createRoot } from 'react-dom/client'

// @ts-ignore
// import { jsx } from 'react/jsx-runtime'

// globalThis['_jsx'] = jsx

if (process.env.NODE_ENV === 'development') {
  startLogging()
}

const FORCE_NOT_CONCURRENT = window.location.search.indexOf(`not-concurrent`) > -1
const ROOT = document.getElementById('root')!

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
  createRoot(ROOT).render(
    <>
      <Root />
    </>
  )
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
