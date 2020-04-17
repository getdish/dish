import React, { createContext, memo, useState } from 'react'

import { isWorker } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import {
  HomeStateItem,
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemUser,
  isHomeState,
  isRestaurantState,
  isSearchState,
  isUserState,
} from '../../state/home'
import { useOvermind } from '../../state/om'
import { ErrorBoundary } from '../ErrorBoundary'
import { VStack, ZStack } from '../ui/Stacks'
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
  const om = useOvermind()
  const { breadcrumbStates } = om.state.home
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
        <HomeStackView items={breadcrumbStates}>
          {(homeState) => {
            return (
              <CurrentStateID.Provider value={homeState.id}>
                {isHomeState(homeState) && (
                  <HomePageTopDishes state={homeState} />
                )}
                {isUserState(homeState) && <HomePageUser state={homeState} />}
                {isSearchState(homeState) && (
                  <HomePageSearchResults state={homeState} />
                )}
                {isRestaurantState(homeState) && (
                  <HomePageRestaurant state={homeState} />
                )}
              </CurrentStateID.Provider>
            )
          }}
        </HomeStackView>
      </HomeViewDrawer>
    </ZStack>
  )
}

export const CurrentStateID = createContext<string>(null)
