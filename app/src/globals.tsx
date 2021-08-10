import { client, mutation, query, resolved } from '@dish/graph'
import * as UseStore from '@dish/use-store'
import React from 'react'

import { isSSR } from './constants/constants'

Error.stackTraceLimit = Infinity

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
  global['matchMedia'] = require('snackui').matchMedia
  window['matchMedia'] = require('snackui').matchMedia

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

global['stores'] = UseStore.allStores
global['$'] = UseStore.allStores
global['useStore'] = UseStore
// @ts-ignore
global['React'] = React
global['gqty'] = gqty
global['map'] = window['map'] // defined in Map
global['mapHelpers'] = window['mapHelpers'] // defined in Map

if (typeof global !== 'undefined') {
  global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout
}
