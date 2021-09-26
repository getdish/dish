import loadable from '@loadable/component'
import React, { Suspense, useEffect } from 'react'
import { AbsoluteVStack, LoadingItems, ToastRoot, useTheme } from 'snackui'

import { isSSR } from '../constants/constants'
import { geoSearch } from '../web/geosearch'
import AdminPage from './admin/AdminPage'
import { AppIntroLetter } from './AppIntroLetter'
import AppMap from './AppMap'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMenuButtonFloating } from './AppMenuButtonFloating'
import { AppSearchBarFloating } from './AppSearchBarFloating'
import { AutocompleteEffects } from './AutocompletesStore'
import { Home } from './home/Home'
import { homeStore } from './homeStore'
import { PrivateRoute, Route, RouteSwitch } from './Route'
import { Shortcuts } from './Shortcuts'
import { ErrorBoundary } from './views/ErrorBoundary'
import { NotFoundPage } from './views/NotFoundPage'

export function App() {
  // useEffect(() => {
  //   geoSearch({
  //     query: 'boba',
  //     ...homeStore.lastHomeOrSearchState.center!,
  //   }).then((res) => {
  //     console.log('got', res)
  //   })
  // }, [])

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
  const theme = useTheme()
  // const isMobileWeb = useIsMobilePhone()

  // if (isMobileWeb) {
  //   return <AppHomeWeb />
  // }

  return (
    <>
      {/* background */}
      <AbsoluteVStack fullscreen zIndex={0} backgroundColor={theme.mapBackground} />

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
        {/*  */}
        <AppMapControlsOverlay />
      </Suspense>

      <Suspense fallback={null}>
        <AppMenuButtonFloating />
      </Suspense>

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
