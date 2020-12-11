import { client, mutation, query, resolved } from '@dish/graph'
import * as React from 'react'

import { isSSR } from '../shared/constants'

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
