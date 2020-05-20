import { LoadingItems, ToastRoot } from '@dish/ui'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import HomePage from './home/HomePage'
import { NotFoundPage } from './NotFoundPage'
import { Route, RouteSwitch } from './router/Route'
import { WelcomeModal } from './WelcomeModal'

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot />
      <Provider value={overmind}>
        <Suspense fallback={<LoadingItems />}>
          <RouteSwitch>
            {/* <PrivateRoute name="tag">
              <TagPage />
            </PrivateRoute> */}
            <Route name="home">
              <HomePage />
            </Route>
            <Route name="notFound">
              <NotFoundPage />
            </Route>
          </RouteSwitch>

          <WelcomeModal />
        </Suspense>
      </Provider>
    </>
  )
}
