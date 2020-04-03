import React, { memo, useState } from 'react'
import { Helmet } from 'react-helmet'
import { ScrollView, Text, View } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemSearch } from '../../state/home'
import { useOvermind } from '../../state/om'
import { PageTitle } from '../shared/PageTitle'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import { Title } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { VStack, ZStack } from '../shared/Stacks'
import { useWaterfall } from '../shared/useWaterfall'
import { CloseButton } from './CloseButton'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'

export default memoIsEqualDeep(function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const title = `Top ${state.searchQuery} Restaurants`
  const prevState = om.state.home.states[om.state.home.states.length - 2]
  const showCloseButton = prevState?.type === 'restaurant'
  const closeButtonOpacity = showCloseButton ? 1 : 0

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <ZStack right={10} top={10} pointerEvents="auto" zIndex={100}>
        <CloseButton
          onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
          opacity={closeButtonOpacity}
        />
      </ZStack>
      <Title>{title}</Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </>
  )
})

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const resultsIds = state.results?.results?.restaurantIds ?? []
    const results = resultsIds.map((id) => allRestaurants[id])

    if (!state.results?.results) {
      return <LoadingItems />
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
)

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
