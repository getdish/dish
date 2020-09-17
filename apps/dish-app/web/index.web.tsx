import './start'
import './base.css'
import './bootstrapEnv'

import { sleep } from '@dish/async'
import { startLogging } from '@dish/graph'
import { LoadingItems, ToastRoot } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'
// @ts-ignore
import { createRoot, hydrate, render } from 'react-dom'
import { AppRegistry } from 'react-native'

import App from '../shared/App'
import { OVERMIND_MUTATIONS, isWorker } from '../shared/constants'
import { ErrorHandler } from '../shared/ErrorHandler'
import AdminPage from '../shared/pages/admin/AdminPage'
import { Shortcuts } from '../shared/Shortcuts'
import { config, om } from '../shared/state/om'
import { NotFoundPage } from '../shared/views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from '../shared/views/router/Route'

if (process.env.NODE_ENV === 'development' && !window['STARTED']) {
  startLogging()
}

// register root component
AppRegistry.registerComponent('dish', () => Root)

function Root({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot />
      <Shortcuts />
      <Provider value={overmind}>
        <ErrorHandler />
        <Suspense fallback={<LoadingItems />}>
          <RouteSwitch>
            <Route name="notFound">
              <NotFoundPage title="404 Not Found" />
            </Route>
            <PrivateRoute name="admin">
              <AdminPage />
            </PrivateRoute>
            {/* home route last because it matches / */}
            <Route name="home">
              <App />
            </Route>
          </RouteSwitch>

          {/* <WelcomeModal /> */}
        </Suspense>
      </Provider>
    </>
  )
}

// exports
if (process.env.TARGET === 'ssr') {
  exports.App = require('../shared/App')
  exports.config = config
  exports.ReactDOMServer = require('react-dom/server')
}

let rootEl = document.getElementById('root')
const search = window.location.search

async function start() {
  // can render splash here

  let done = false
  await Promise.race([
    om.initialized,
    sleep(1000).then(() => {
      if (!done) {
        console.warn('\n\n\nOM TIMED OUT!!!\n\n\n')
      }
    }),
  ])
  done = true

  if (OVERMIND_MUTATIONS) {
    hydrate(<Root overmind={om} />, document.getElementById('root'))
  } else {
    // for worker
    if (isWorker) {
      rootEl = document.createElement('div')
      document.body.appendChild(rootEl)
    }

    if (search.indexOf(`concurrent`) > -1) {
      console.warn('👟 Concurrent Mode Running')
      createRoot(rootEl).render(<Root overmind={om} />)
    } else {
      render(<Root overmind={om} />, rootEl)
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  // @ts-ignore
  module?.hot?.accept()
  // @ts-ignore
  module?.hot?.accept('../shared/state/om')
}

// can remove this started check once overmind works better for hmr
if (!window['STARTED'] && process.env.TARGET !== 'ssr') {
  start()
  window['STARTED'] = true
}
