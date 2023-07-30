import { isSSR } from '../constants/constants'
import { AppIntroLetter } from './AppIntroLetter'
import AppMap from './AppMap'
import AppMapContainer from './AppMapContainer'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { PrivateRoute, Route, RouteSwitch } from './Route'
import { Shortcuts } from './Shortcuts'
import AdminPage from './admin/AdminPage'
import { Home } from './home/Home'
import { ErrorBoundary } from './views/ErrorBoundary'
import { NotFoundPage } from './views/NotFoundPage'
import { AbsoluteYStack, LoadingItems, ToastRoot, YStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { Suspense, useEffect } from 'react'

export function useLoadApp() {
  return true
}

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
          <Route name="home">
            <PublicContent />
          </Route>
          <PrivateRoute name="admin">
            <AdminPage />
          </PrivateRoute>
          <Route name="notFound">
            <PublicContent>
              <NotFoundPage />
            </PublicContent>
          </Route>
        </RouteSwitch>
      </Suspense>
    </>
  )
}

function PublicContent(props: { children?: any }) {
  return (
    <>
      {/* background */}
      <AbsoluteYStack fullscreen zIndex={0} backgroundColor="$backgroundStrong" />

      <Suspense fallback={null}>
        {/* THIS IS THE DRAWER AND ITS CONTENTS */}
        <Home />
      </Suspense>

      {!isSSR && (
        <ErrorBoundary name="main-map">
          <Suspense fallback={null}>
            <AppMapContainer>
              <AppMap />
            </AppMapContainer>
          </Suspense>
        </ErrorBoundary>
      )}

      <Suspense fallback={null}>
        <AppIntroLetter />
      </Suspense>

      <Suspense fallback={null}>
        <AppMenuButtonFloating />
      </Suspense>

      {/* Modals outside the above YStack to stay above */}
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

      {props.children}
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
