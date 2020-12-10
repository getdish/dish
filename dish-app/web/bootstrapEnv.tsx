import React from 'react'

import { isSSR, isWorker } from '../shared/constants'

if (isSSR) {
  console.log('Patching useLayoutEffect to avoid many warnings in server mode')
  React.useLayoutEffect = React.useEffect
}

if (isWorker) {
  window['isWorker'] = true
  // @ts-ignore
  document.cookie = document.cookie || ''
  // @ts-ignore
  window.history = window.history || {
    pathname: '/',
    location: null,
    replaceState() {},
    pushState() {},
  }
}
