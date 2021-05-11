import loadable from '@loadable/component'
import React, { Suspense, useEffect } from 'react'
import { LoadingItems, ToastRoot, VStack, useTheme } from 'snackui'

import { isSSR } from '../constants/constants'
import AdminPage from './admin/AdminPage'
import { AppIntroLetter } from './AppIntroLetter'
import AppMap from './AppMap'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMenuButton } from './AppMenuButton'
import { AppSearchBarFloating } from './AppSearchBarFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { Home } from './home/Home'
import { PrivateRoute, Route, RouteSwitch } from './Route'
import { Shortcuts } from './Shortcuts'
import { ErrorBoundary } from './views/ErrorBoundary'
import { NotFoundPage } from './views/NotFoundPage'

export function App() {
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
        <ToastRoot />
        <Shortcuts />
        <AutocompleteEffects />
      </Suspense>
      <Suspense fallback={<LoadingItems />}>
        <RouteSwitch>
          <Route name="notFound">
            <NotFoundPage title="404 Not Found" />
          </Route>
          <PrivateRoute name="admin">
            <AdminPage />
          </PrivateRoute>
          <Route name="home">
            <AppHomeContent />
          </Route>
        </RouteSwitch>
      </Suspense>
    </>
  )
}

function AppHomeContent() {
  const theme = useTheme()

  return (
    <>
      <VStack
        zIndex={0}
        flex={1}
        maxWidth="100%"
        maxHeight="100%"
        overflow="hidden"
        // map bg
        backgroundColor={theme.mapBackground}
      >
        <Suspense fallback={null}>
          <Home />
        </Suspense>

        {!isSSR && (
          <ErrorBoundary name="main-map">
            <Suspense fallback={null}>
              {/*  */}
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

        <Suspense fallback={null}>
          <AppMenuButton />
        </Suspense>
      </VStack>

      <Suspense fallback={null}>
        <AppSearchBarFloating />
      </Suspense>

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
}

const UserEditPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./home/userEdit/UserEditPage').default
    : loadable(() => import('./home/userEdit/UserEditPage'))

const GalleryPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./home/gallery/GalleryPage').default
    : loadable(() => import('./home/gallery/GalleryPage'))

const RestaurantReviewPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./home/restaurantReview/RestaurantReviewPage').default
    : loadable(() => import('./home/restaurantReview/RestaurantReviewPage'))

const RestaurantHoursPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./home/restaurantHours/RestaurantHoursPage').default
    : loadable(() => import('./home/restaurantHours/RestaurantHoursPage'))
