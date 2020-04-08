import { ApolloProvider } from '@apollo/client'
import { createApolloClient } from '@dish/models'
import { Provider } from 'overmind-react'
import React, { Suspense } from 'react'

import { NotFoundPage } from './NotFoundPage'
import { useOvermind } from '../state/om'
import HomePage from './home/HomePageView'
import { PrivateRoute, Route, RouteSwitch } from './shared/Route'
import { ToastRoot } from './shared/ToastRoot'
import TagPage from './tag/TagPage'
import { setToastHandle } from './Toast'
import { WelcomeModal } from './WelcomeModal'

const apolloClient = createApolloClient()

export function App({ overmind }: { overmind?: any }) {
  return (
    <>
      <ToastRoot ref={setToastHandle} />
      <Provider value={overmind}>
        <AppContent />
      </Provider>
    </>
  )
}

function AppContent() {
  const om = useOvermind()

  // could have splash here
  if (!om.state.home.started) {
    return null
  }

  return (
    <ApolloProvider client={apolloClient}>
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
  )
}

// const HomePageLazy = React.lazy(() => import('./home/HomePageView'))
// const TagPageLazy = React.lazy(() => import('./tag/TagPage'))
