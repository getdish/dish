import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@dish/models'
import { Provider } from 'overmind-react'
import React, { Suspense, useRef } from 'react'

import { om } from '../state/om'
import HomePage from './home/HomePageView'
import { PrivateRoute, Route, RouteSwitch } from './shared/Route'
import { ToastRoot } from './shared/ToastRoot'
import TaxonomyPage from './taxonomy/TaxonomyPage'

const apolloClient = createApolloClient()
// const HomePageLazy = React.lazy(() => import('./home/HomePageView'))
// const TaxonomyPageLazy = React.lazy(() => import('./taxonomy/TaxonomyPage'))

let toastHandle
export const Toast = {
  show: (message: string, duration: number = 1000) => {
    toastHandle.show(message, duration)
  },
}

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot ref={(x) => (toastHandle = x)} />
      <Provider value={overmind ?? om}>
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
          </Suspense>
        </ApolloProvider>
      </Provider>
    </>
  )
}
