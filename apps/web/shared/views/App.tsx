import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import HomePage from './home/HomePage'
import { LoadingItems } from './home/LoadingItems'
import { NotFoundPage } from './NotFoundPage'
import { ToastRoot } from './Toast'
import { Route, RouteSwitch } from './ui/Route'
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
