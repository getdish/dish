import { sleep } from '@dish/async'
import { AbsoluteVStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { Suspense, memo, useEffect } from 'react'

import HomeAutocomplete from './AppAutocomplete'
import { AppContainer } from './AppContainer'
import { HomeIntroLetter } from './AppIntroLetter'
import { AppMapControlsOverlay } from './AppMapControlsOverlay'
import { AppMapControlsUnderlay } from './AppMapControlsUnderlay'
import { AppMenuFloating } from './AppMenuFloating'
import { AppRoot } from './AppRoot'
import { HomeSearchBarFloating } from './AppSearchBar'
import { AppStackView } from './AppStackView'
import { bgLight } from './colors'
import { isSSR } from './constants'
import { initAppleSigninButton } from './helpers/initAppleSigninButton'
import { useIsNarrow } from './hooks/useIs'
import { PagesStackView } from './pages/PagesStackView'
import { ErrorBoundary } from './views/ErrorBoundary'
import { Route } from './views/router/Route'

export default memo(function App() {
  const isSmall = useIsNarrow()

  useEffect(() => {
    // workaround apple id requirement to init 3 buttons

    // init popover button
    initAppleSigninButton()

    // init footer button
    sleep(500).then(() => {
      initAppleSigninButton()
    })

    //Listen for authorization success
    const handleAppleSuccess = (data) => {
      console.log('got apple res', data)
    }
    const handleAppleFailure = (error) => {
      console.log('got apple err', error)
    }
    document.addEventListener('AppleIDSignInOnSuccess', handleAppleSuccess)
    document.addEventListener('AppleIDSignInOnFailure', handleAppleFailure)
    return () => {
      document.removeEventListener('AppleIDSignInOnSuccess', handleAppleSuccess)
      document.removeEventListener('AppleIDSignInOnFailure', handleAppleFailure)
    }
  }, [])

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

      <AppMenuFloating />

      <Suspense fallback={null}>
        {!isSSR && (
          <ErrorBoundary name="main-map">
            <Suspense fallback={null}>
              <AppMap />
            </Suspense>
          </ErrorBoundary>
        )}

        <HomeIntroLetter />

        <Suspense fallback={null}>
          <AppMapControlsUnderlay />
          <AppMapControlsOverlay />
        </Suspense>

        <HomeSearchBarFloating />
        <HomeAutocomplete />

        <Suspense fallback={null}>
          <GalleryPage />
          <RestaurantReviewPage />

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
