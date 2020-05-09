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
import { ZStack } from '../ui/Stacks'
import { CurrentStateID } from './CurrentStateID'
import { HomeMap } from './HomeMap'
import { HomeMapControlsOverlay } from './HomeMapControlsOverlay'
import { HomeMapPIP } from './HomeMapPIP'
import HomePageRestaurant from './HomePageRestaurant'
import HomePageSearchResults from './HomePageSearchResults'
import HomePageTopDishes from './HomePageTopDishes'
import HomePageUser from './HomePageUser'
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
    <ZStack fullscreen>
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
    </ZStack>
  )
}
