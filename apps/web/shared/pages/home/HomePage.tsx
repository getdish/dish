import { AbsoluteVStack, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { ErrorBoundary } from '../../views/ErrorBoundary'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeContainer } from './HomeContainer'
import { HomeMap } from './HomeMap'
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
        <ErrorBoundary name="main-map">
          <Suspense fallback={null}>
            <HomeMap />
          </Suspense>
        </ErrorBoundary>

        <Suspense fallback={null}>
          <HomeMapControlsUnderlay />
          <HomeMapControlsOverlay />
        </Suspense>

        <HomeSearchBarFloating />
        <HomeAutocomplete />

        <HomeContainer>
          <HomeStackView>
            {(props) => {
              return <HomePagePane {...props} />
            }}
          </HomeStackView>
        </HomeContainer>

        <Suspense fallback={null}>
          <HomePageGallery />
        </Suspense>
      </Suspense>
    </>
  )
})

const HomePageGallery =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageGallery').default
    : React.lazy(() => import('./HomePageGallery'))
