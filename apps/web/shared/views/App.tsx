import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@dish/models'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import HomePage from './home/HomePage'
import { NotFoundPage } from './NotFoundPage'
import TagPage from './tag/TagPage'
import { setToastHandle } from './Toast'
import { PrivateRoute, Route, RouteSwitch } from './ui/Route'
import { ToastRoot } from './ui/ToastRoot'
import { WelcomeModal } from './WelcomeModal'

const apolloClient = createApolloClient()

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot ref={setToastHandle} />
      <Provider value={overmind}>
        <ApolloProvider client={apolloClient as any}>
          <Suspense fallback={'ok'}>
            <RouteSwitch>
              <PrivateRoute name="tag">
                <TagPage />
              </PrivateRoute>
              <Route name="home">
                <HomePage />
              </Route>
              <Route name="notFound">
                <NotFoundPage />
              </Route>
            </RouteSwitch>

            <WelcomeModal />
          </Suspense>
        </ApolloProvider>
      </Provider>
    </>
  )
}

// const HomePageLazy = React.lazy(() => import('./home/HomePageView'))
// const TagPageLazy = React.lazy(() => import('./tag/TagPage'))
