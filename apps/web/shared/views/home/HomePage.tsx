import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { isWorker } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { ErrorBoundary } from '../ErrorBoundary'
import { LinearGradient } from '../ui/LinearGradient'
import { VStack, ZStack } from '../ui/Stacks'
import { CurrentStateID } from './CurrentStateID'
import { HomeMap } from './HomeMap'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapPIP } from './HomeMapPIP'
import HomeSearchBar from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { HomeViewDrawer } from './HomeViewDrawer'

export const homePageBorderRadius = 12

export default memo(function HomePage() {
  const [showPip, setShowPip] = useState(false)

  useDebounceEffect(
    () => {
      setShowPip(true)
    },
    100,
    []
  )

  return (
    <VStack flex={1} backgroundColor="rgba(253,253,253,1)" alignItems="center">
      <VStack
        backgroundColor="#fff"
        width={`calc(100% + ${homePageBorderRadius * 2}px)`}
        height="100%"
        maxWidth={1880}
        borderRadius={homePageBorderRadius}
        // marginLeft={-homePageBorderRadius / 2}
        marginVertical={-1}
        shadowColor="rgba(0,0,0,0.13)"
        shadowRadius={100}
        overflow="hidden"
        // marginHorizontal={-20}
        // paddingHorizontal={20}
      >
        {!isWorker && (
          <ErrorBoundary name="maps">
            <Suspense fallback={null}>
              <HomeMap />
            </Suspense>
            {showPip && <HomeMapPIP />}
          </ErrorBoundary>
        )}
        <HomeMapControlsOverlay />
        <HomeSearchBar />

        {/* overlay map subtle */}
        <ZStack
          fullscreen
          bottom="auto"
          height={100}
          pointerEvents="none"
          zIndex={2}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']}
            style={StyleSheet.absoluteFill}
          />
        </ZStack>

        <HomeViewDrawer>
          <HomeStackView>
            {(homeState, isActive, index) => {
              return (
                <CurrentStateID.Provider value={homeState.id}>
                  <Suspense fallback={null}>
                    {isHomeState(homeState) && (
                      <HomePageTopDishes stateIndex={index} />
                    )}
                    {isUserState(homeState) && (
                      <HomePageUser stateIndex={index} />
                    )}
                    {isSearchState(homeState) && (
                      <HomePageSearchResults stateIndex={index} />
                    )}
                    {isRestaurantState(homeState) && (
                      <HomePageRestaurant stateIndex={index} />
                    )}
                  </Suspense>
                </CurrentStateID.Provider>
              )
            }}
          </HomeStackView>
        </HomeViewDrawer>

        <HomePageGallery />
      </VStack>
    </VStack>
  )
})

const HomePageRestaurant =
  process.env.TARGET === 'ssr'
    ? require('./HomePageRestaurant').default
    : React.lazy(() => import('./HomePageRestaurant'))

const HomePageSearchResults =
  process.env.TARGET === 'ssr'
    ? require('./HomePageSearchResults').default
    : React.lazy(() => import('./HomePageSearchResults'))

const HomePageTopDishes =
  process.env.TARGET === 'ssr'
    ? require('./HomePageTopDishes').default
    : React.lazy(() => import('./HomePageTopDishes'))

const HomePageUser =
  process.env.TARGET === 'ssr'
    ? require('./HomePageUser').default
    : React.lazy(() => import('./HomePageUser'))

const HomePageGallery =
  process.env.TARGET === 'ssr'
    ? require('./HomePageGallery').default
    : React.lazy(() => import('./HomePageGallery'))
