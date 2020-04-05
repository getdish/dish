const React = require('react')

if (process.env.TARGET == 'worker') {
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

if (process.env.TARGET == 'preact') {
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
