import './start'

import { LoadingItems, ToastRoot } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import { ErrorHandler } from './ErrorHandler'
import AdminPage from './pages/admin/AdminPage'
import HomePage from './pages/home/HomePage'
import { Shortcuts } from './Shortcuts'
import { NotFoundPage } from './views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from './views/router/Route'

export function App({ overmind }: { overmind?: any }) {
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
              <HomePage />
            </Route>
          </RouteSwitch>

          {/* <WelcomeModal /> */}
        </Suspense>
      </Provider>
    </>
  )
}
