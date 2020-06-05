import {
  LinearGradient,
  VStack,
  ZStack,
  useDebounceEffect,
  useWaterfall,
} from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'

import { frameWidthMax, isWorker } from '../../constants'
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
  return (
    <VStack flex={1} alignItems="center">
      <VStack
        // apple maps ocean color
        backgroundColor="#B8E0F3"
        width={`calc(100% + ${homePageBorderRadius * 2}px)`}
        height="100%"
        maxWidth={frameWidthMax}
        borderRadius={homePageBorderRadius}
        shadowColor="rgba(0,0,0,0.05)"
        shadowRadius={50}
        overflow="hidden"
        position="relative"
      >
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
                        <HomePageTopDishes key={0} state={homeState} />
                      )}
                      {isUserState(homeState) && (
                        <HomePageUser key={1} state={homeState} />
                      )}
                      {isSearchState(homeState) && (
                        <HomePageSearchResults key={2} state={homeState} />
                      )}
                      {isRestaurantState(homeState) && (
                        <HomePageRestaurant key={3} state={homeState} />
                      )}
                    </Suspense>
                  </CurrentStateID.Provider>
                )
              }}
            </HomeStackView>
          </HomeViewDrawer>

          <Suspense fallback={null}>
            <HomePageGallery />
          </Suspense>
        </Suspense>
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
