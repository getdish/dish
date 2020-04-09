import { isPreact, isSSR, isWorker } from '../shared/constants'

const React = require('react')

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

if (isPreact) {
  require('preact/debug')
  React['__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED'] = {
    ReactCurrentOwner: {
      get current() {
        return {
          elementType: {
            componentId: '',
          },
        }
      },
    },
  }
}
