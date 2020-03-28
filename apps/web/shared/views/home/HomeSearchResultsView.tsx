import React, { useMemo, useLayoutEffect, useState, useEffect } from 'react'
import { Text, ScrollView, FlatList, View } from 'react-native'

import { useOvermind } from '../../state/om'
import { RestaurantListItem } from './RestaurantListItem'
import { Title } from '../shared/SmallTitle'
import { VStack } from '../shared/Stacks'
import { HomeStateItemSearch } from '../../state/home'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import HomeLenseBar from './HomeLenseBar'
import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { useWaterfall } from '../shared/useWaterfall'
import { Spacer } from '../shared/Spacer'

export default memoIsEqualDeep(function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  return (
    <VStack flex={1}>
      <Title>Top {state.searchQuery} Restaurants</Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </VStack>
  )
})

function HomeSearchResultsViewContent({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const allRestaurants = om.state.home.restaurants
  const resultsIds =
    ((state.results?.status == 'complete' &&
      state.results?.results?.restaurantIds) ||
      undefined) ??
    []
  const results = resultsIds.map((id) => allRestaurants[id])

  if (state.results?.status == 'loading') {
    return (
      <VStack padding={18}>
        <Text>Loading...</Text>
      </VStack>
    )
  }

  return (
    <List
      data={[20 + 70, ...results, 20]}
      estimatedHeight={182}
      renderItem={({ item, index }) => {
        if (typeof item == 'number') {
          return <Spacer size={item} />
        }
        return (
          <RestaurantListItem
            key={item.id}
            restaurant={item}
            rank={index}
            onHover={() => {
              om.actions.home.setHoveredRestaurant(item)
            }}
          />
        )
      }}
    />
  )
}

function List(props: {
  data: any[]
  estimatedHeight?: number
  renderItem: (arg: { item: any; index: number }) => React.ReactNode
}) {
  // TODO suspense or flatlist depending for now simple waterfall
  return (
    <ScrollView
      onScroll={() => {
        if (popoverCloseCbs.size) {
          closeAllPopovers()
        }
      }}
    >
      {props.data.map((item, index) => (
        <ListItem estimatedHeight={props.estimatedHeight} key={item.id}>
          {props.renderItem({ item, index })}
        </ListItem>
      ))}
    </ScrollView>
  )
}

function ListItem(props) {
  const [isMounted, setIsMounted] = useState(false)
  useWaterfall(() => {
    setIsMounted(true)
  })
  return isMounted
    ? props.children
    : props.loading ?? <View style={{ height: props.estimatedHeight }} />
}
