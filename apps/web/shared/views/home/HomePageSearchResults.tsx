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
import { LinkButton } from '../ui/Link'
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

export const avatar = require('../../assets/peach.png')

export default memo(({ state }: { state: HomeStateItemSearch }) => {
  const om = useOvermind()
  const { currentLocationName: locationName } = om.state.home

  const tags = getActiveTags(om.state.home)
  const lense = tags.find((x) => x.type === 'lense')
  const titleTags = tags.filter(
    (tag) => tag.type === 'dish' || tag.name === 'Delivers'
  )
  const isEditingUserList = isEditingUserPage(om.state)
  const countryTag = tags.find((x) => x.type === 'country')?.name ?? ''
  const dishTag = tags.find((x) => x.type === 'dish')?.name ?? ''
  const hasUser = !!state.user
  const userPrefix = hasUser ? `${state.user.username}'s ` : ''
  let lensePlaceholder = lense?.description ?? lense?.name ?? ''
  if (hasUser) {
    lensePlaceholder = lensePlaceholder.toLowerCase()
  }
  const titleSpace = titleTags.length ? ' ' : ''
  const searchName = state.searchQuery ?? ''

  const subTitleParts = countryTag
    ? [countryTag, `restaurants in ${locationName}`]
    : [dishTag, `dishes in ${locationName}`]

  const subTitle = (
    <>
      <strong>{subTitleParts[0]}</strong> {subTitleParts[1]}
    </>
  )

  const titleTagsString = titleTags.map((x) => `${x.name ?? ''}`).join(', ')

  const titleSubject = lensePlaceholder.replace('🍔', titleTagsString)
  const title = `${userPrefix} ${titleSubject} ${searchName} ${subTitleParts.join(
    ' '
  )}`

  const pageTitleElements = (
    <>
      {userPrefix}
      {titleSubject.split('🍔').map((x) => {
        if (x === '🍔') {
          return (
            <>
              {titleTags.map((tag) => (
                <TagButton
                  key={getTagId(tag)}
                  tag={tag}
                  subtle
                  noColor
                  hideIcon
                />
              ))}
            </>
          )
        }
        return x
      })}
      {titleSpace}
      {}
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
              {isEditingUserList && (
                <SmallCircleButton
                  onPress={() => {
                    Toast.show('Saved')
                    om.actions.router.navigate({
                      name: 'search',
                      params: {
                        ...om.state.router.curPage.params,
                        username: '',
                      },
                    })
                  }}
                  paddingHorizontal={12}
                >
                  <Text style={{ color: 'white' }}>Done</Text>
                </SmallCircleButton>
              )}
              {!isEditingUserList && (
                <SmallCircleButton
                  onPress={() => {
                    om.actions.home.forkCurrentList()
                  }}
                >
                  <Icon name="Edit2" size={12} color="white" />
                </SmallCircleButton>
              )}
            </HStack>
          </HStack>
        )}

        <PageTitle subTitle={subTitle}>{pageTitleElements}</PageTitle>
      </HStack>

      <VStack
        marginTop={-18}
        position="relative"
        flex={1}
        paddingTop={6}
        overflow="hidden"
      >
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
        <VStack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          spacing
        >
          <Text style={{ fontSize: 22 }}>No results 😞</Text>
          <LinkButton name="contact">Send us the address</LinkButton>
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
