import { onGraphError } from '@dish/graph'
// import { RecoilRoot } from '@dish/recoil-store'
import { LoadingItems, Toast, ToastRoot, useOnMount } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import AdminPage from './pages/admin/AdminPage'
import HomePage from './pages/home/HomePage'
import { useOvermind } from './state/useOvermind'
import { NotFoundPage } from './views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from './views/router/Route'

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot />
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
