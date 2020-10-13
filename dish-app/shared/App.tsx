if (process.env.NODE_ENV === 'development') {
  require('@dish/ui/style.css')
}

import { Auth, query, resolved } from '@dish/graph'
import { isSafari } from '@dish/helpers'
import { AbsoluteVStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { Suspense, memo, useEffect } from 'react'

import HomeAutocomplete from './AppAutocomplete'
import { AppContainer } from './AppContainer'
import { AppIntroLetter } from './AppIntroLetter'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMapControlsUnderlay } from './AppMapControlsUnderlay'
import { AppMenuFloating } from './AppMenuFloating'
import { AppRoot } from './AppRoot'
import { HomeSearchBarFloating } from './AppSearchBar'
import { AppStackView } from './AppStackView'
import { bgLight } from './colors'
import { isSSR, isWeb } from './constants'
import { useIsNarrow } from './hooks/useIs'
import { PagesStackView } from './pages/PagesStackView'
import { ErrorBoundary } from './views/ErrorBoundary'
import { Route } from './views/router/Route'

export default memo(function App() {
  const isSmall = useIsNarrow()

  // dont run if in ssr mode
  if (isWeb) {
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

  return (
    <AbsoluteVStack
      fullscreen
      overflow="hidden"
      backgroundColor={bgLight} // map color
      {...(isSmall && {
        borderRadius: 10,
      })}
    >
      <AppContent />
    </AbsoluteVStack>
  )
})

const AppContent = memo(() => {
  return (
    <AppRoot>
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
        <AppMenuFloating />
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
          <HomeSearchBarFloating />
        </Suspense>
        <Suspense fallback={null}>
          <HomeAutocomplete />
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
    </AppRoot>
  )
})

const AppMap =
  process.env.TARGET === 'ssr' ? null : loadable(() => import('./AppMap'))

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
