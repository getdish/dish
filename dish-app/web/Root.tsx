import { useHydrateCache } from '@dish/graph'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'
import { LoadingItems, ToastRoot } from 'snackui'

import App from '../shared/App'
import { ErrorHandler } from '../shared/ErrorHandler'
import AdminPage from '../shared/pages/admin/AdminPage'
import { Shortcuts } from '../shared/Shortcuts'
import { NotFoundPage } from '../shared/views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from '../shared/views/router/Route'

if (typeof window !== 'undefined') {
  window['requestIdleCallback'] = window['requestIdleCallback'] || setTimeout
}

const cacheSnapshot =
  //@ts-expect-error
  typeof window !== 'undefined' ? window.__CACHE_SNAPSHOT : undefined

export function Root({ overmind }: { overmind?: any }) {
  if (cacheSnapshot) {
    console.log('cacheSnapshot', cacheSnapshot)
    useHydrateCache({
      cacheSnapshot,
    })
  } else {
    console.log('no cache snapshot')
  }

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
            <Route name="home">
              <App />
            </Route>
          </RouteSwitch>
        </Suspense>
      </Provider>
    </>
  )
}
