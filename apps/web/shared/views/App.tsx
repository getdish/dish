import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@dish/models'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import { config } from '../state/om'
import HomePage from './home/HomePageView'
import { PrivateRoute, Route, RouteSwitch } from './shared/Route'
import { ToastRoot } from './shared/ToastRoot'
import TaxonomyPage from './taxonomy/TaxonomyPage'
import { setToastHandle } from './Toast'
import { WelcomeModal } from './WelcomeModal'

const apolloClient = createApolloClient()

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot ref={setToastHandle} />
      <Provider value={overmind}>
        <ApolloProvider client={apolloClient}>
          <Suspense fallback={'ok'}>
            <RouteSwitch>
              <PrivateRoute name="taxonomy">
                <TaxonomyPage />
              </PrivateRoute>
              <Route name="home">
                <HomePage />
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
// const TaxonomyPageLazy = React.lazy(() => import('./taxonomy/TaxonomyPage'))
