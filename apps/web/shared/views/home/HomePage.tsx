import React, { memo, useState } from 'react'

import { isWorker } from '../../constants'
import { searchBarHeight } from '../../constants'
import { useDebounceEffect } from '../../hooks/useDebounceEffect'
import {
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
import { HomeControlsOverlay } from './HomeControlsOverlay'
import { HomeMap } from './HomeMap'
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
    <ZStack top={0} left={0} right={0} bottom={0}>
      {!isWorker && (
        <ErrorBoundary name="maps">
          <HomeMap />
          {showPip && <HomeMapPIP />}
        </ErrorBoundary>
      )}
      <HomeControlsOverlay />
      <HomeSearchBar />
      <HomeViewDrawer>
        <HomeViewContent />
      </HomeViewDrawer>
    </ZStack>
  )
}

const HomeViewContent = memo(() => {
  const om = useOvermind()
  const { breadcrumbStates } = om.state.home
  return (
    <>
      <ZStack position="relative" flex={1}>
        <VStack
          position="absolute"
          top={searchBarHeight}
          left={0}
          right={0}
          bottom={0}
          flex={1}
        >
          <HomeStackView items={breadcrumbStates}>
            {(homeState) => {
              return (
                <>
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
                </>
              )
            }}
          </HomeStackView>
        </VStack>
      </ZStack>
    </>
  )
})
