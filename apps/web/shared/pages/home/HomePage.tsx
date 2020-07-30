import { VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { frameWidthMax, isWorker } from '../../constants'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import HomeAutocomplete from './HomeAutocomplete'
import { HomeContainer } from './HomeContainer'
import { HomeMap } from './HomeMap'
import { HomeMapPIP } from './HomeMapPIP'
import { HomePagePane } from './HomePagePane'
import { HomeSearchBarDrawer, HomeSearchBarFloating } from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()

  return (
    <VStack
      // apple maps ocean color
      backgroundColor="#B8E0F3"
      width={isSmall ? '100%' : `calc(100% + ${homePageBorderRadius * 2}px)`}
      height="100%"
      maxWidth={frameWidthMax}
      borderRadius={homePageBorderRadius}
      shadowColor="rgba(0,0,0,0.05)"
      shadowRadius={50}
      overflow="hidden"
      position="relative"
    >
      <HomePageContent />
    </VStack>
  )
})

const HomePageContent = memo(() => {
  return (
    <>
      <Suspense fallback={null}>
        {!isWorker && (
          <ErrorBoundary name="maps">
            <Suspense fallback={null}>
              <HomeMap />
            </Suspense>
            <Suspense fallback={null}>
              <HomeMapPIP />
            </Suspense>
          </ErrorBoundary>
        )}

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
