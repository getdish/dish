import { client, mutation, query, resolved } from '@dish/graph'
import React from 'react'

import { isSSR } from '../constants/constants'

if (isSSR) {
  console.log('Patching useLayoutEffect to avoid many warnings in server mode')
  React.useLayoutEffect = React.useEffect
}

window['React'] = React
window['gqless'] = {
  query,
  mutation,
  client,
  resolved,
}

if (typeof window !== 'undefined') {
  window['requestIdleCallback'] = window['requestIdleCallback'] || setTimeout
}
