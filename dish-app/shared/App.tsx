import loadable from '@loadable/component'
import React, { Suspense, memo, useEffect } from 'react'
import { LoadingItems, ToastRoot, VStack } from 'snackui'

import { AppContainer } from './AppContainer'
import { AppIntroLetter } from './AppIntroLetter'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchBarFloating } from './AppSearchBar'
import { AppStackView } from './AppStackView'
import { isSSR } from './constants'
import AdminPage from './pages/admin/AdminPage'
import { PagesStackView } from './pages/PagesStackView'
import { Shortcuts } from './Shortcuts'
import { ErrorBoundary } from './views/ErrorBoundary'
import { NotFoundPage } from './views/NotFoundPage'
import { PrivateRoute, Route, RouteSwitch } from './views/router/Route'

export function App() {
  return (
    <>
      <ToastRoot />
      <Shortcuts />
      <Suspense fallback={<LoadingItems />}>
        <RouteSwitch>
          <Route name="notFound">
            <NotFoundPage title="404 Not Found" />
          </Route>
          <PrivateRoute name="admin">
            <AdminPage />
          </PrivateRoute>
          <Route name="home">
            <AppMain />
          </Route>
        </RouteSwitch>
      </Suspense>
    </>
  )
}

const AppMain = memo(function AppMain() {
  // helper that warns on root level unmounts (uncaught suspense)
  if (process.env.NODE_ENV === 'development') {
    useEffect(() => {
      return () => {
        console.warn('\n\nUNCAUGHT SUSPENSE SOMEWHERE -- FIX IT!!\n\ns')
      }
    }, [])
  }

  return (
    <>
      <Suspense fallback={null}>
        <AppSearchBarFloating />
      </Suspense>

      <Suspense fallback={null}>
        <AppMenuButton />
      </Suspense>

      <VStack
        zIndex={0}
        // borderRadius={12}
        flex={1}
        maxWidth="100%"
        maxHeight="100%"
        overflow="hidden"
        backgroundColor="#dbdeeb"
      >
        <Suspense fallback={null}>
          <AppContainer>
            <AppStackView>
              {(props) => {
                return <PagesStackView {...props} />
              }}
            </AppStackView>
          </AppContainer>
        </Suspense>

        <Suspense fallback={null}>
          {!isSSR && (
            <ErrorBoundary name="main-map">
              <Suspense fallback={null}>
                <AppMap />
              </Suspense>
            </ErrorBoundary>
          )}

          <Suspense fallback={null}>
            <AppIntroLetter />
          </Suspense>

          <Suspense fallback={null}>
            <AppMapControlsOverlay />
          </Suspense>
        </Suspense>
      </VStack>

      {/* Modals outside the above VStack to stay above */}
      <Suspense fallback={null}>
        <UserEditPage />
      </Suspense>
      <Suspense fallback={null}>
        <GalleryPage />
      </Suspense>
      <Suspense fallback={null}>
        <RestaurantReviewPage />
      </Suspense>
      <Suspense fallback={null}>
        <Route name="restaurantHours">
          <RestaurantHoursPage />
        </Route>
      </Suspense>
    </>
  )
})

const AppMap =
  process.env.TARGET === 'ssr'
    ? null
    : process.env.NODE_ENV === 'development'
    ? require('./AppMap').default
    : loadable(() => import('./AppMap'))

const UserEditPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/userEdit/UserEditPage').default
    : loadable(() => import('./pages/userEdit/UserEditPage'))

const GalleryPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/gallery/GalleryPage').default
    : loadable(() => import('./pages/gallery/GalleryPage'))

const RestaurantReviewPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/restaurantReview/RestaurantReviewPage').default
    : loadable(() => import('./pages/restaurantReview/RestaurantReviewPage'))

const RestaurantHoursPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/restaurantHours/RestaurantHoursPage').default
    : loadable(() => import('./pages/restaurantHours/RestaurantHoursPage'))
