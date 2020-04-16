import React, { memo, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import {
  HomeStateItemSearch,
  getActiveTags,
  isEditingUserPage,
} from '../../state/home'
import { useOvermind } from '../../state/om'
import { getTagId } from '../../state/Tag'
import { Toast } from '../Toast'
import { Circle } from '../ui/Circle'
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

const avatar = require('../../assets/peach.png')

export default memo(({ state }: { state: HomeStateItemSearch }) => {
  const om = useOvermind()
  const { locationName } = om.state.home

  const tags = getActiveTags(om.state.home)
  const lense = tags.find((x) => x.type === 'lense')
  const titleTags = tags.filter(
    (tag) => tag.type === 'dish' || tag.name === 'Delivers'
  )
  const isEditingUserList = isEditingUserPage(om.state)
  const countryTag = tags.find((x) => x.type === 'country')?.name ?? ''
  const hasUser = !!state.user
  const userPrefix = hasUser ? `${state.user.username}'s ` : ''
  let lenseName = lense?.description ?? lense?.name ?? ''
  if (hasUser) {
    lenseName = lenseName.toLowerCase()
  }
  const titleSpace = titleTags.length ? '' : ' '
  const searchName = state.searchQuery ?? ''
  const subTitle = (
    <>
      <strong>{countryTag}</strong> restaurants in the {locationName}
    </>
  )

  const title = `${userPrefix} ${lenseName}${titleSpace}${titleTags
    .map((x) => x.name)
    .join(', ')} ${searchName} ${subTitle}`

  const pageTitleElements = (
    <>
      {userPrefix}
      {lenseName}
      {titleSpace}
      {titleTags.map((tag) => (
        <TagButton
          key={getTagId(tag)}
          tag={
            tag.name === 'Delivers' ? { ...tag, displayName: 'delivery' } : tag
          }
          subtle
          noColor
          hideIcon
        />
      ))}
      {searchName}
    </>
  )

  return (
    <>
      <PageTitleTag>{title}</PageTitleTag>
      <ZStack
        right={10}
        top={10}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          <CloseButton onPress={() => om.actions.home.up()} />
        </HStack>
      </ZStack>

      <HStack paddingHorizontal={om.state.user.isLoggedIn ? 60 : 0}>
        {om.state.user.isLoggedIn && (
          <HStack zIndex={100} position="absolute" top={10} left={10} spacing>
            <Circle size={34}>
              <Image source={avatar} style={{ width: 34, height: 34 }} />
            </Circle>

            <HStack spacing="sm" alignItems="center">
              {/* {isEditingUserList && (
              <SmallCircleButton
                onPress={() => {
                  Toast.show('Saved')
                }}
                paddingHorizontal={12}
              >
                <Text style={{ color: 'white' }}>Save</Text>
              </SmallCircleButton>
            )} */}
              {!isEditingUserList && (
                <SmallCircleButton
                  onPress={() => {
                    om.actions.home.forkCurrentList()
                  }}
                >
                  <Icon name="edit-2" size={12} color="white" />
                </SmallCircleButton>
              )}
            </HStack>
          </HStack>
        )}

        <PageTitle subTitle={subTitle}>{pageTitleElements}</PageTitle>
      </HStack>

      <VStack marginTop={-6} position="relative" flex={1} overflow="hidden">
        <HomeLenseBar activeTagIds={state.activeTagIds} />
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
