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

export function Root({
  overmind,
  cacheSnapshot,
}: {
  overmind?: any
  cacheSnapshot?: string
}) {
  if (cacheSnapshot) {
    useHydrateCache({
      cacheSnapshot,
    })
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
