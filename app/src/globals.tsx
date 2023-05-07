import { isSSR } from './constants/constants'
import { client, mutation, query, resolved } from '@dish/graph'
import * as UseStore from '@tamagui/use-store'
import React from 'react'

Error.stackTraceLimit = Infinity

global['setImmediate'] = global['setImmediate'] || setTimeout

if (process.env.TARGET === 'web' && process.env.NODE_ENV === 'production') {
  // web only stuff, we do native in index.js
  // load it lazy its huge
  import('./web/sentry')
}

global['React'] = React

const gqty = {
  query,
  mutation,
  client,
  resolved,
}

if (isSSR) {
  console.log('Patching useLayoutEffect to avoid many warnings in server mode')
  // @ts-ignore
  React.useLayoutEffect = React.useEffect
}

if (process.env.TARGET === 'native') {
  // global['matchMedia'] = require('tamagui').matchMedia
  // window['matchMedia'] = global['matchMedia']

  if (process.env.NODE_ENV === 'development') {
    console.log('⬇️ ⬇️ ⬇️ set debugger here for repl on stuff')
    function rndebugger() {
      gqty
      const stores = UseStore.allStores
      stores
      // ➡️➡️➡️➡️➡️➡️➡️ here
    }
    setInterval(rndebugger, 1000)
  }
}

if (process.env.NODE_ENV === 'development') {
  global['stores'] = UseStore.allStores
  global['$'] = UseStore.allStores
  global['useStore'] = UseStore
  // @ts-ignore
  global['gqty'] = gqty
  global['map'] = window['map'] // defined in Map
  global['mapHelpers'] = window['mapHelpers'] // defined in Map
}

if (typeof global !== 'undefined') {
  global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout
}
