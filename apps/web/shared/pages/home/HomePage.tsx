import { sleep } from '@dish/async'
import { AbsoluteVStack } from '@dish/ui'
import loadable from '@loadable/component'
import React, { Suspense, memo, useEffect } from 'react'

import { isSSR } from '../../constants'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { Route } from '../../views/router/Route'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeContainer } from './HomeContainer'
import { HomeIntroLetter } from './HomeIntroLetter'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapControlsUnderlay } from './HomeMapControlsUnderlay'
import { HomePagePane } from './HomePagePane'
import { HomeSearchBarFloating } from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { initAppleSigninButton } from './initAppleSigninButton'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()

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
      backgroundColor="#C9E9F6" // map color
      {...(isSmall && {
        borderRadius: 10,
      })}
    >
      <HomePageContent />
    </AbsoluteVStack>
  )
})

const HomePageContent = memo(() => {
  return (
    <>
      {/* WARNING: DONT PUT ANYTHING ABOVE THIS IN MARKUP ^^ */}
      <Suspense fallback={null}>
        <HomeContainer>
          <HomeStackView>
            {(props) => {
              return <HomePagePane {...props} />
            }}
          </HomeStackView>
        </HomeContainer>
      </Suspense>

      <Suspense fallback={null}>
        {!isSSR && (
          <ErrorBoundary name="main-map">
            <Suspense fallback={null}>
              <HomeMap />
            </Suspense>
          </ErrorBoundary>
        )}

        <HomeIntroLetter />

        <Suspense fallback={null}>
          <HomeMapControlsUnderlay />
          <HomeMapControlsOverlay />
        </Suspense>

        <HomeSearchBarFloating />
        <HomeAutocomplete />

        <Suspense fallback={null}>
          <HomePageGallery />
          <HomePageRestaurantReview />

          <Route name="restaurantHours">
            <HomePageRestaurantHours />
          </Route>
        </Suspense>
      </Suspense>
    </>
  )
})

const HomeMap =
  process.env.TARGET === 'ssr' ? null : loadable(() => import('./HomeMap'))

const HomePageGallery =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageGallery').default
    : loadable(() => import('./HomePageGallery'))

const HomePageRestaurantReview =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurantReview').default
    : loadable(() => import('./HomePageRestaurantReview'))

const HomePageRestaurantHours =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurantHours').default
    : loadable(() => import('./HomePageRestaurantHours'))
