import React, { memo, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'

import { memoIsEqualDeep } from '../../helpers/memoIsEqualDeep'
import { HomeStateItemSearch } from '../../state/home'
import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { Icon } from '../ui/Icon'
import { PageTitle } from '../ui/PageTitle'
import { PageTitleTag } from '../ui/PageTitleTag'
import { closeAllPopovers, popoverCloseCbs } from '../ui/Popover'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useWaterfall } from '../ui/useWaterfall'
import { BackButton, CloseButton, SmallCircleButton } from './CloseButton'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'
import { TagButton } from './TagButton'

export default memo(({ state }: { state: HomeStateItemSearch }) => {
  const om = useOvermind()
  const tags = Object.keys(state.activeTagIds).map(
    (k) => om.state.home.allTags[k]
  )
  const lense = tags.find((x) => x.type === 'lense')
  const titleTags = tags.filter(
    (tag) =>
      tag.type === 'dish' || tag.type === 'country' || tag.name === 'Delivers'
  )
  const title = `Top ${titleTags.map((x) => x.name).join(', ')} ${
    state.searchQuery ?? ''
  } Restaurants`
  return (
    <>
      <PageTitleTag>{title}</PageTitleTag>
      <ZStack
        left={10}
        top={10}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          <BackButton
            onPress={() => om.actions.home.popTo(om.state.home.lastHomeState)}
          />
        </HStack>
      </ZStack>
      <ZStack
        right={10}
        top={10}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          <SmallCircleButton
            onPress={() => {
              om.actions.home.forkCurrentList()
            }}
          >
            <Icon name="edit-2" size={12} color="white" />
          </SmallCircleButton>
        </HStack>
      </ZStack>
      <PageTitle height={57}>
        {lense?.description ?? lense?.name}
        {titleTags.map((tag) => (
          <TagButton
            key={getTagId(tag)}
            tag={
              tag.name === 'Delivers'
                ? { ...tag, displayName: 'delivery' }
                : tag
            }
            subtle
            // closable
            onClose={() => {
              om.actions.home.setTagInactive(tag)
              // if (titleTags.length === 1) {
              //   om.actions.home.popTo(om.state.home.lastHomeState)
              // }
            }}
          />
        ))}
        {om.state.home.currentStateSearchQuery} in San Francisco
      </PageTitle>
      <VStack position="relative" flex={1} overflow="hidden">
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
