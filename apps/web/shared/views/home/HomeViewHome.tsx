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
import { TouchableOpacity } from 'react-native'

export const drawerBorderRadius = 20

export default function HomeViewHome() {
  const om = useOvermind()
  return (
    <>
      <SearchBar />
      <HomeFilterBar />

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
          <HomeStackView items={om.state.home.breadcrumbStates}>
            {(homeState) => {
              return (
                <>
                  {homeState.type == 'home' && (
                    <HomeViewTopDishes state={homeState} />
                  )}
                  {homeState.type == 'search' && (
                    <HomeSearchResultsView state={homeState} />
                  )}
                  {homeState.type == 'restaurant' && (
                    <HomeRestaurantView state={homeState} />
                  )}
                </>
              )
            }}
          </HomeStackView>
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

function HomeStackView<A extends HomeStateItem>({
  items,
  children,
}: {
  items: A[]
  children: (a: A, isActive: boolean, index: number) => React.ReactNode
}) {
  const om = useOvermind()
  // const [items, setItems] = useState<A[]>([])
  // const isAdding = props.items.length > items.length

  // useEffect(() => {
  //   setTimeout(() => {
  //     setItems(props.items)
  //   }, 16)
  // }, [props.items, items])

  return (
    <ZStack fullscreen>
      {items.map((x, index) => {
        const item = (x as any) as HomeStateItem
        const key = `${index}`
        const isTop = index === items.length - 1
        const contents = children(
          item as any,
          index === items.length - 1,
          index
        )
        console.log('keys are', key, contents)
        return (
          <Animatable.View
            key={key}
            animation="fadeInUp"
            pointerEvents={isTop ? 'none' : 'auto'}
            duration={300}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
            <TouchableOpacity
              disabled={isTop}
              style={{ flex: 1 }}
              onPress={() => {
                om.actions.home.popTo(x)
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
                pointerEvents="auto"
                // overflow="hidden"
              >
                {contents}
              </ZStack>
            </TouchableOpacity>
          </Animatable.View>
        )
      })}
    </ZStack>
  )
}
