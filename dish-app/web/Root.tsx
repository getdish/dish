import { LoadingItems, ToastRoot } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import App from '../shared/App'
import { ErrorHandler } from '../shared/ErrorHandler'
import AdminPage from '../shared/pages/admin/AdminPage'
import { Shortcuts } from '../shared/Shortcuts'
import { NotFoundPage } from '../shared/views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from '../shared/views/router/Route'

export function Root({ overmind }: { overmind?: any }) {
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
