import './HomeViewContent.css'

import React, { memo, useEffect, useMemo, useState } from 'react'
import { TouchableOpacity } from 'react-native'

import { searchBarHeight } from '../../constants'
import { useDebounceValue } from '../../hooks/useDebounce'
import {
  HomeStateItemHome,
  HomeStateItemRestaurant,
  HomeStateItemSearch,
  HomeStateItemSimple,
} from '../../state/home'
import { useOvermind } from '../../state/om'
import { ForceShowPopover } from '../shared/Popover'
import { VStack, ZStack } from '../shared/Stacks'
import HomeRestaurantView from './HomeRestaurantView'
import HomeSearchResultsView from './HomeSearchResultsView'
import { HomeStackView } from './HomeStackView'
import HomeViewTopDishes from './HomeViewTopDishes'

export const HomeViewContent = memo(function HomeViewContent() {
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
                  {homeState.type == 'home' && (
                    <HomeViewTopDishes state={homeState as HomeStateItemHome} />
                  )}
                  {homeState.type == 'search' && (
                    <HomeSearchResultsView
                      state={homeState as HomeStateItemSearch}
                    />
                  )}
                  {homeState.type == 'restaurant' && (
                    <HomeRestaurantView
                      state={homeState as HomeStateItemRestaurant}
                    />
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
