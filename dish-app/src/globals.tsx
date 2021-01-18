import { client, mutation, query, resolved } from '@dish/graph'
import * as UseStore from '@dish/use-store'
import React from 'react'

import { isSSR } from './constants/constants'

if (isSSR) {
  console.log('Patching useLayoutEffect to avoid many warnings in server mode')
  React.useLayoutEffect = React.useEffect
}

global['stores'] = UseStore.allStores
global['useStore'] = UseStore
global['React'] = React
global['gqless'] = {
  query,
  mutation,
  client,
  resolved,
}

if (typeof global !== 'undefined') {
  global['requestIdleCallback'] = global['requestIdleCallback'] || setTimeout
}
