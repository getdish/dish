import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import HomePage from './home/HomePage'
import { LoadingItems } from './home/LoadingItems'
import { NotFoundPage } from './NotFoundPage'
import { setToastHandle } from './Toast'
import { Route, RouteSwitch } from './ui/Route'
import { ToastRoot } from './ui/ToastRoot'
import { WelcomeModal } from './WelcomeModal'

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot ref={setToastHandle} />
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

// const HomePageLazy = React.lazy(() => import('./home/HomePageView'))
// const TagPageLazy = React.lazy(() => import('./tag/TagPage'))
