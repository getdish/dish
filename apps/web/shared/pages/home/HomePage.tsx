import { AbsoluteVStack, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { isSSR } from '../../constants'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeContainer } from './HomeContainer'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapControlsUnderlay } from './HomeMapControlsUnderlay'
import { HomePagePane } from './HomePagePane'
import { HomeSearchBarFloating } from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()
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
      <Suspense fallback={null}>
        {!isSSR && (
          <ErrorBoundary name="main-map">
            <Suspense fallback={null}>
              <HomeMap />
            </Suspense>
          </ErrorBoundary>
        )}

        <HomeContainer>
          <HomeStackView>
            {(props) => {
              return <HomePagePane {...props} />
            }}
          </HomeStackView>
        </HomeContainer>

        <Suspense fallback={null}>
          <HomeMapControlsUnderlay />
          <HomeMapControlsOverlay />
        </Suspense>

        <HomeSearchBarFloating />
        <HomeAutocomplete />

        <Suspense fallback={null}>
          <HomePageGallery />
          <HomePageRestaurantReview />
        </Suspense>
      </Suspense>
    </>
  )
})

const HomeMap =
  process.env.TARGET === 'ssr' ? null : React.lazy(() => import('./HomeMap'))

const HomePageGallery =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageGallery').default
    : React.lazy(() => import('./HomePageGallery'))

const HomePageRestaurantReview =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurantReview').default
    : React.lazy(() => import('./HomePageRestaurantReview'))
