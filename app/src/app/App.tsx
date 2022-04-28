import { isSSR } from '../constants/constants'
import { AppHomeMobileWeb } from './AppHomeMobileWeb'
import { AppIntroLetter } from './AppIntroLetter'
import AppMap from './AppMap'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { RootPortalProvider } from './Portal'
import { PrivateRoute, Route, RouteSwitch } from './Route'
import { Shortcuts } from './Shortcuts'
import AdminPage from './admin/AdminPage'
import { Home } from './home/Home'
import { useIsMobilePhone } from './useIsMobilePhone'
import { ErrorBoundary } from './views/ErrorBoundary'
import { NotFoundPage } from './views/NotFoundPage'
import { AbsoluteYStack, LoadingItems, ToastRoot, YStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { Suspense, useEffect } from 'react'

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
            <AppHomeContent>
              <NotFoundPage />
            </AppHomeContent>
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

function AppHomeContent(props: { children?: any }) {
  const isMobileWeb = useIsMobilePhone()

  if (isMobileWeb) {
    return (
      <>
        <AppHomeMobileWeb />
      </>
    )
  }

  return (
    <>
      {/* background */}
      <AbsoluteYStack fullscreen zIndex={0} backgroundColor="$mapBackground" />

      <RootPortalProvider />

      <Suspense fallback={null}>
        {/* THIS IS THE DRAWER AND ITS CONTENTS */}
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
        {/*  */}
        <AppMapControlsOverlay />
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
  process.env.TARGET === 'ssr'
    ? require('./home/userEdit/UserEditPage').default
    : loadable(() => import('./home/userEdit/UserEditPage'))

const GalleryPage =
  process.env.TARGET === 'ssr'
    ? require('./home/gallery/GalleryPage').default
    : loadable(() => import('./home/gallery/GalleryPage'))

const RestaurantReviewPage =
  process.env.TARGET === 'ssr'
    ? require('./home/restaurantReview/RestaurantReviewPage').default
    : loadable(() => import('./home/restaurantReview/RestaurantReviewPage'))

const RestaurantHoursPage =
  process.env.TARGET === 'ssr'
    ? require('./home/restaurantHours/RestaurantHoursPage').default
    : loadable(() => import('./home/restaurantHours/RestaurantHoursPage'))
