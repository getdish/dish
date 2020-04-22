import React, { memo, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { HomeStateItemSearch, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { NotFoundPage } from '../NotFoundPage'
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
import { CloseButton, SmallCircleButton } from './CloseButton'
import { getTitleForState } from './getTitleForState'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'

export const avatar = require('../../assets/peach.png')

export default memo(({ stateIndex }: { stateIndex: number }) => {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemSearch
  if (!state) return <NotFoundPage />
  const isEditingUserList = isEditingUserPage(om.state)
  const { title, subTitleElements, pageTitleElements } = getTitleForState(
    om.state,
    state
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

        <PageTitle subTitle={subTitleElements}>{pageTitleElements}</PageTitle>
      </HStack>

      <VStack
        marginTop={-18}
        position="relative"
        flex={1}
        paddingTop={6}
        overflow="hidden"
      >
        <HomeLenseBar stateIndex={stateIndex} />
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </>
  )
})

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const topPad = 20 + 80

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
              currentLocationInfo={state.currentLocationInfo}
              key={item.id}
              restaurant={item}
              rank={index}
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
