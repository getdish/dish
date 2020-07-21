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
import { HomeStackView, StackItemProps } from './HomeStackView'
import { HomeViewDrawer } from './HomeViewDrawer'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const isSmall = useMediaQueryIsSmall()
  console.log('rendering me...')
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

export type HomePagePaneProps<
  A extends HomeStateItem = HomeStateItem
> = StackItemProps<A>

const HomePagePane = (props: HomePagePaneProps) => {
  const { item } = props
  return (
    <Suspense fallback={null}>
      {isHomeState(item) && <HomePageHomePane {...props} />}
      {isUserState(item) && <HomePageUser {...props} />}
      {isSearchState(item) && <HomePageSearchResults {...props} />}
      {isRestaurantState(item) && <HomePageRestaurant {...props} />}
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
