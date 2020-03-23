import React, { useState, useEffect } from 'react'

import * as Animatable from 'react-native-animatable'
import { useOvermind } from '../../state/om'
import HomeRestaurantView from './HomeRestaurantView'
import HomeViewTopDishes from './HomeViewTopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import SearchBar from './SearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, StackBaseProps, HStack } from '../shared/Stacks'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { Route } from '../shared/Route'
import { SmallTitle } from '../shared/SmallTitle'
import { HomeStateItem } from '../../state/home'
import _ from 'lodash'
import { HomeFilterBar } from './HomeFilterBar'
import { LinearGradient } from 'expo-linear-gradient'

export const drawerBorderRadius = 20

export default function HomeViewHome() {
  const om = useOvermind()
  const { currentState } = om.state.home

  return (
    <>
      <SearchBar />

      <HomeFilterBar />

      <VStack height={29} alignItems="center">
        <SmallTitle>
          {currentState.type == 'home' && `Top Dishes`}
          {currentState.type == 'search' &&
            `Top ${currentState.searchQuery} Restaurants`}
        </SmallTitle>
      </VStack>

      <ZStack position="relative" flex={1}>
        <VStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          flex={1}
          paddingVertical={20}
        >
          <StackView items={om.state.home.breadcrumbStates}>
            {(homeState) => {
              const item = om.state.router.history.find(
                (x) => x.id == homeState.historyId
              )
              return (
                <>
                  <Route exact name="home" forHistory={item}>
                    <HomeViewTopDishes />
                  </Route>
                  <Route name="search" forHistory={item}>
                    <HomeSearchResultsView />
                  </Route>
                  <Route name="restaurant" forHistory={item}>
                    <HomeRestaurantView />
                  </Route>
                </>
              )
            }}
          </StackView>
        </VStack>

        <ZStack fullscreen pointerEvents="none">
          <VStack flex={1}>
            <Spacer flex={1} />

            <HStack
              paddingVertical={20}
              paddingHorizontal={20}
              paddingTop={30}
              borderRadius={drawerBorderRadius}
              overflow="hidden"
            >
              <LinearGradient
                colors={['transparent', '#fff', '#fff']}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  zIndex: -1,
                }}
              />

              <VStack pointerEvents="auto">
                <HomeBreadcrumbs />
              </VStack>
            </HStack>
          </VStack>
        </ZStack>
      </ZStack>
    </>
  )
}

function StackView<A>(props: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const [items, setItems] = useState<A[]>([])
  const isAdding = props.items.length > items.length

  useEffect(() => {
    setTimeout(() => {
      setItems(props.items)
    }, 16)
  }, [props.items, items])

  return (
    <ZStack fullscreen>
      {items.map((item, index) => (
        <Animatable.View
          key={
            JSON.stringify(
              (_.omit((item as any) as HomeStateItem), 'historyId')
            ) + index
          }
          animation="fadeInUp"
          duration={300}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        >
          <ZStack
            backgroundColor="white"
            fullscreen
            flex={1}
            zIndex={index}
            top={index * 20}
            shadowColor="rgba(0,0,0,0.2)"
            shadowRadius={7}
            borderRadius={drawerBorderRadius}
            overflow="hidden"
          >
            {props.children(item, index === items.length - 1, index)}
          </ZStack>
        </Animatable.View>
      ))}
    </ZStack>
  )
}
