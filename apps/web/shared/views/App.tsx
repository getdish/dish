import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@dish/models'
import { Provider } from 'overmind-react'
import React from 'react'

import { om } from '../state/om'
import { HomePage } from './home/HomePageView'
import { PrivateRoute, Route, RouteSwitch } from './shared/Route'
import { TaxonomyPage } from './taxonomy/TaxonomyPage'

const apolloClient = createApolloClient()

export function App({ overmind }: { overmind?: any }) {
  return (
    <Provider value={overmind ?? om}>
      <ApolloProvider client={apolloClient}>
        <RouteSwitch>
          <PrivateRoute name="taxonomy">
            <TaxonomyPage />
          </PrivateRoute>
          <Route name="home">
            <HomePage />
          </Route>
        </RouteSwitch>
      </ApolloProvider>
    </Provider>
  )
}
