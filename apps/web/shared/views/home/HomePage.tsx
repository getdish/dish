import { LinearGradient, VStack, ZStack, useDebounceEffect } from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { isWorker } from '../../constants'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { ErrorBoundary } from '../ErrorBoundary'
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
    <VStack flex={1} alignItems="center">
      <VStack
        backgroundColor="#fff"
        width={`calc(100% + ${homePageBorderRadius * 2}px)`}
        height="100%"
        maxWidth={1880}
        borderRadius={homePageBorderRadius}
        marginVertical={-1}
        shadowColor="rgba(0,0,0,0.05)"
        shadowRadius={50}
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
        {/* <ZStack
          fullscreen
          bottom="auto"
          height={100}
          pointerEvents="none"
          zIndex={2}
        >
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0)']}
            style={StyleSheet.absoluteFill}
          />
        </ZStack> */}

        <HomeViewDrawer>
          <HomeStackView>
            {(homeState, isActive, index) => {
              return (
                <CurrentStateID.Provider value={homeState.id}>
                  <Suspense fallback={null}>
                    {isHomeState(homeState) && (
                      <HomePageTopDishes key={0} stateIndex={index} />
                    )}
                    {isUserState(homeState) && (
                      <HomePageUser key={1} stateIndex={index} />
                    )}
                    {isSearchState(homeState) && (
                      <HomePageSearchResults key={2} stateIndex={index} />
                    )}
                    {isRestaurantState(homeState) && (
                      <HomePageRestaurant key={3} stateIndex={index} />
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
