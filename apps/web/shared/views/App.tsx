import { onGraphError } from '@dish/graph'
// import { RecoilRoot } from '@dish/recoil-store'
import { LoadingItems, Toast, ToastRoot, useOnMount } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import { useOvermind } from '../state/useOvermind'
import HomePage from './home/HomePage'
import { NotFoundPage } from './NotFoundPage'
import { Route, RouteSwitch } from './router/Route'
import { WelcomeModal } from './WelcomeModal'

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot />
      <Provider value={overmind}>
        <ErrorHandler />
        <Suspense fallback={<LoadingItems />}>
          <RouteSwitch>
            {/* <PrivateRoute name="tag">
              <TagPage />
            </PrivateRoute> */}
            <Route name="home">
              <HomePage />
            </Route>
            <Route name="notFound">
              <NotFoundPage title="404 Not Found" />
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
