import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableOpacityProps,
} from 'react-native'

import * as Animatable from 'react-native-animatable'
import { useOvermind } from '../../state/om'
import HomeRestaurantView from './HomeRestaurantView'
import HomeViewTopDishes from './HomeViewTopDishes'
import HomeSearchResultsView from './HomeSearchResultsView'
import SearchBar from './SearchBar'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack, StackBaseProps, HStack } from '../shared/Stacks'
import { useWindowSize } from '../../hooks/useWindowSize'
import { HomeBreadcrumbs } from './HomeBreadcrumbs'
import { Route } from '../shared/Route'
import { SmallTitle } from '../shared/SmallTitle'
import { HomeStateItem } from '../../state/home'
import _ from 'lodash'
import { BlurView } from './BlurView'

export const drawerBorderRadius = 20

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    bottom: 20,
    borderRadius: drawerBorderRadius,
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
  },
  content: {
    flex: 1,
    paddingVertical: 20,
  },
  button: {
    padding: 10,
  },
})

export default function HomeMainPane() {
  const om = useOvermind()
  const { currentState } = om.state.home

  return (
    <>
      <SearchBar />

      <HomeBreadcrumbs />

      <Spacer />

      <VStack height={40} alignItems="center">
        <SmallTitle>
          {currentState.type == 'home' && `Top Dishes`}
          {currentState.type == 'search' &&
            `Top ${currentState.searchQuery} Restaurants`}
        </SmallTitle>
      </VStack>

      <View style={styles.content}>
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
      </View>
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
