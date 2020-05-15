import React, { Suspense, useState } from 'react'

import { isWorker } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import {
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home-helpers'
import { ErrorBoundary } from '../ErrorBoundary'
import { VStack } from '../ui/Stacks'
import { CurrentStateID } from './CurrentStateID'
import { HomeMap } from './HomeMap'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapPIP } from './HomeMapPIP'
import HomeSearchBar from './HomeSearchBar'
import { HomeStackView } from './HomeStackView'
import { HomeViewDrawer } from './HomeViewDrawer'

export default function HomePage() {
  const [showPip, setShowPip] = useState(false)

  useDebounceEffect(
    () => {
      setShowPip(true)
    },
    100,
    []
  )

  return (
    <VStack flex={1} backgroundColor="#000" alignItems="center">
      <VStack
        backgroundColor="#fff"
        width="100%"
        height="100%"
        maxWidth={1880}
        borderRadius={6}
        overflow="hidden"
        // marginHorizontal={-20}
        // paddingHorizontal={20}
      >
        {!isWorker && (
          <ErrorBoundary name="maps">
            <HomeMap />
            {showPip && <HomeMapPIP />}
          </ErrorBoundary>
        )}
        <HomeMapControlsOverlay />
        <HomeSearchBar />
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
      </VStack>
    </VStack>
  )
}

const HomePageRestaurant = React.lazy(() => import('./HomePageRestaurant'))
const HomePageSearchResults = React.lazy(() =>
  import('./HomePageSearchResults')
)
const HomePageTopDishes = React.lazy(() => import('./HomePageTopDishes'))
const HomePageUser = React.lazy(() => import('./HomePageUser'))
