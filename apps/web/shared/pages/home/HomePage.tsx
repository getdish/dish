import { VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { frameWidthMax, isWorker } from '../../constants'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { HomeMap } from './HomeMap'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapPIP } from './HomeMapPIP'
import { HomePagePane } from './HomePagePane'
import HomeSearchBar from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { HomeViewDrawer } from './HomeViewDrawer'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()
  return (
    <VStack className="hellow-rol" flex={1} alignItems="center">
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

        <Suspense fallback={null}>
          <HomeMapControlsOverlay />
        </Suspense>

        <Suspense fallback={null}>
          <HomeSearchBar />
        </Suspense>

        <HomeViewDrawer>
          <HomeStackView>
            {(props) => {
              console.log('HomePagePane', HomePagePane)
              return <HomePagePane {...props} />
            }}
          </HomeStackView>
        </HomeViewDrawer>

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
