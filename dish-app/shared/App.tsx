import { Auth } from '@dish/graph'
import { isSafari } from '@dish/helpers'
import loadable from '@loadable/component'
import React, { Suspense, memo, useEffect } from 'react'
import { VStack } from 'snackui'

import HomeAutocomplete from './AppAutocomplete'
import { AppContainer } from './AppContainer'
import { AppIntroLetter } from './AppIntroLetter'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMapControlsUnderlay } from './AppMapControlsUnderlay'
import { AppMenuFloating } from './AppMenuFloating'
import { AppRoot } from './AppRoot'
import { AppSearchBarFloating } from './AppSearchBar'
import { AppStackView } from './AppStackView'
import { isSSR, isWeb } from './constants'
import { PagesStackView } from './pages/PagesStackView'
import { ErrorBoundary } from './views/ErrorBoundary'
import { Route } from './views/router/Route'

export default memo(function App() {
  // dont run if in ssr mode
  if (isWeb && !isSSR) {
    const { auth } = require('../web/apple-sign-in')
    useEffect(() => {
      auth.init({
        clientId: 'com.dishapp',
        scope: 'name email',
        redirectURI: Auth.getRedirectUri(),
        usePopup: isSafari,
      })
    }, [])
  }

  return <AppContent />
})

const AppContent = memo(() => {
  return (
    <AppRoot>
      <Suspense fallback={null}>
        <AppSearchBarFloating />
      </Suspense>

      <Suspense fallback={null}>
        <AppMenuFloating />
      </Suspense>

      <Suspense fallback={null}>
        <HomeAutocomplete />
      </Suspense>

      <VStack
        zIndex={0}
        borderRadius={12}
        flex={1}
        maxWidth="100%"
        maxHeight="100%"
        overflow="hidden"
        backgroundColor="#dbdeeb"
      >
        {/* WARNING: DONT PUT ANYTHING ABOVE THIS IN MARKUP ^^ */}
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
            <AppMapControlsUnderlay />
            <AppMapControlsOverlay />
          </Suspense>

          <Suspense fallback={null}>
            <GalleryPage />
          </Suspense>
          <Suspense fallback={null}>
            <RestaurantReviewPage />
          </Suspense>
          <Suspense fallback={null}>
            <RestaurantReviewsPage />
          </Suspense>
          <Suspense fallback={null}>
            <UserEditPage />
          </Suspense>
          <Suspense fallback={null}>
            <Route name="restaurantHours">
              <RestaurantHoursPage />
            </Route>
          </Suspense>
        </Suspense>
      </VStack>
    </AppRoot>
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

const RestaurantReviewsPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/restaurantReviews/RestaurantReviewsPage').default
    : loadable(() => import('./pages/restaurantReviews/RestaurantReviewsPage'))

const RestaurantHoursPage =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./pages/restaurantHours/RestaurantHoursPage').default
    : loadable(() => import('./pages/restaurantHours/RestaurantHoursPage'))
