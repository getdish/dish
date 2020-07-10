import { VStack } from '@dish/ui'
import React, { Suspense, memo, useEffect } from 'react'

import { frameWidthMax, isWorker } from '../../constants'
import { HomeStateItem } from '../../state/home'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { ErrorBoundary } from '../../views/ErrorBoundary'
import { HomeMap } from './HomeMap'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapPIP } from './HomeMapPIP'
import HomeSearchBar from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { HomeViewDrawer, useMediaQueryIsSmall } from './HomeViewDrawer'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()
  return (
    <VStack flex={1} alignItems="center">
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
            {(homeState, isActive) => {
              return <HomePagePane state={homeState} isActive={isActive} />
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

export type HomePagePaneProps = { state: HomeStateItem; isActive: boolean }

const HomePagePane = (props: HomePagePaneProps) => {
  const { state } = props
  return (
    <Suspense fallback={null}>
      {isHomeState(state) && <HomePageHomePane {...props} />}
      {isUserState(state) && <HomePageUser {...props} />}
      {isSearchState(state) && <HomePageSearchResults {...props} />}
      {isRestaurantState(state) && <HomePageRestaurant {...props} />}
    </Suspense>
  )
}

const HomePageRestaurant =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageRestaurant').default
    : React.lazy(() => import('./HomePageRestaurant'))

const HomePageSearchResults =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageSearchResults').default
    : React.lazy(() => import('./HomePageSearchResults'))

const HomePageHomePane =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageHomePane').default
    : React.lazy(() => import('./HomePageHomePane'))

const HomePageUser =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageUser').default
    : React.lazy(() => import('./HomePageUser'))

const HomePageGallery =
  process.env.TARGET === 'ssr' || process.env.NODE_ENV === 'development'
    ? require('./HomePageGallery').default
    : React.lazy(() => import('./HomePageGallery'))
