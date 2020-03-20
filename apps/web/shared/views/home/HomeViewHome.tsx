import React, { useState, useEffect } from 'react'
import { View, StyleSheet, Text, ScrollView } from 'react-native'

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
import { HomeStateItem, Taxonomy } from '../../state/home'
import _ from 'lodash'
import { DishButton } from '../shared/Link'

export const drawerBorderRadius = 20

export default function HomeViewHome() {
  const om = useOvermind()
  const { currentState } = om.state.home

  return (
    <>
      <SearchBar />

      <HomeBreadcrumbs />

      <Spacer />

      <VStack height={26} alignItems="center">
        <SmallTitle>
          {currentState.type == 'home' && `Top Dishes`}
          {currentState.type == 'search' &&
            `Top ${currentState.searchQuery} Restaurants`}
        </SmallTitle>
      </VStack>

      {currentState.type == 'home' && (
        <VStack height={60} paddingVertical={12}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <HStack paddingHorizontal={20}>
              {currentState.lenses.map((lense, index) => (
                <React.Fragment key={lense.id}>
                  <LenseButton
                    lense={lense}
                    active={index == currentState.activeLense}
                  />
                  <Spacer />
                </React.Fragment>
              ))}
            </HStack>
          </ScrollView>
        </VStack>
      )}

      <VStack flex={1} paddingVertical={20}>
        <StackView items={om.state.home.breadcrumbStates}>
          {homeState => {
            const item = om.state.router.history.find(
              x => x.id == homeState.historyId
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
    </>
  )
}

function LenseButton({ lense, active }: { lense: Taxonomy; active: boolean }) {
  return (
    <DishButton>
      <HStack
        alignItems="center"
        justifyContent="center"
        paddingHorizontal={8}
        paddingVertical={5}
        backgroundColor={active ? '#fff' : 'rgba(255,255,255,0.5)'}
        borderRadius={8}
        shadowColor="rgba(0,0,0,0.1)"
        shadowOffset={{ height: 1, width: 0 }}
      >
        <Text style={{ color: active ? '#000' : '#444', fontSize: 16 }}>
          {lense.icon} {lense.name}
        </Text>
      </HStack>
    </DishButton>
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
            shadowColor="rgba(0,0,0,0.15)"
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
