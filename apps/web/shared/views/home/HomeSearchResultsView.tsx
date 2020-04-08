import React, { memo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemSearch } from '../../state/home'
import { useOvermind } from '../../state/om'
import { PageTitle } from '../shared/PageTitle'
import { closeAllPopovers, popoverCloseCbs } from '../shared/Popover'
import { Title } from '../shared/SmallTitle'
import { Spacer } from '../shared/Spacer'
import { HStack, VStack, ZStack } from '../shared/Stacks'
import { useWaterfall } from '../shared/useWaterfall'
import { BackButton, CloseButton } from './CloseButton'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'
import { TagButton } from './TagButton'
import { getTagId } from '../../state/Tag'

export default memoIsEqualDeep(function HomeSearchResultsView({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const tags = Object.keys(state.activeTagIds).map(
    (k) => om.state.home.allTags[k]
  )
  const titleTags = tags.filter(
    (tag) => tag.type === 'dish' || tag.type === 'country'
  )
  const title = `Top ${titleTags
    .map((x) => x.name)
    .join(', ')} ${state.searchQuery ?? ''} Restaurants`
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <ZStack
        right={10}
        top={0}
        height={40}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          {/* <SmallButton>
            <Icon name="plus" size={12} />
          </SmallButton> */}
          <BackButton
            onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
          />
        </HStack>
      </ZStack>
      <Title height={45}>
        Top{' '}
        {titleTags.map((tag) => (
          <TagButton key={getTagId(tag)} tag={tag} />
        ))}{' '}
        Restaurants
      </Title>
      <VStack position="relative" flex={1}>
        <HomeLenseBar activeTagIds={state.activeTagIds} backgroundGradient />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </>
  )
})

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const topPad = 20 + 70

    if (!state.results?.results || state.results.status === 'loading') {
      return (
        <VStack paddingTop={topPad}>
          <LoadingItems />
        </VStack>
      )
    }

    const resultsIds = state.results?.results?.restaurantIds
    const results = resultsIds.map((id) => allRestaurants[id])

    if (!results.length) {
      return (
        <VStack height="100vh" alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 28 }}>No results 😞</Text>
        </VStack>
      )
    }

    return (
      <List
        data={[topPad, ...results, 20]}
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
