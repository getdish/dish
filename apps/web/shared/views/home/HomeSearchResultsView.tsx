import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import { ScrollView, Text, View } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemSearch } from '../../state/home'
import { useOvermind } from '../../state/om'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import { Title } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { VStack } from '../shared/Stacks'
import { useWaterfall } from '../shared/useWaterfall'
import HomeLenseBar from './HomeLenseBar'
import { RestaurantListItem } from './RestaurantListItem'

export default memoIsEqualDeep(function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const title = `Top ${state.searchQuery} Restaurants`
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Title>{title}</Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </>
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
  console.log('HomeSearchResults.results', results)

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
        <ListItem
          estimatedHeight={props.estimatedHeight}
          key={item.id ?? index}
        >
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
