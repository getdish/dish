import './start'

import { onGraphError } from '@dish/graph'
import { LoadingItems, Toast, ToastRoot, useOnMount } from '@dish/ui'
import { UseStoreRoot } from '@dish/use-store'
import { Provider } from 'overmind-react'
import React, { StrictMode, Suspense } from 'react'

import AdminPage from './pages/admin/AdminPage'
import HomePage from './pages/home/HomePage'
import { Shortcuts } from './Shortcuts'
import { useOvermind } from './state/om'
import { NotFoundPage } from './views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from './views/router/Route'

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <UseStoreRoot>
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
      </UseStoreRoot>
    </>
  )
}

function ErrorHandler() {
  const om = useOvermind()

  useOnMount(() => {
    onGraphError((errors) => {
      console.warn('got errors', errors)

      if (errors.some((err) => err.message.includes('JWTExpired')))
        for (const err of errors) {
          console.warn('HANDLING JWT ERR')
          Toast.show(`Login has expired`)
          om.actions.user.logout()
        }
    })
  })

  return null
}
