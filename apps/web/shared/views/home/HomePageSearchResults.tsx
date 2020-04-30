import React, { memo, useState } from 'react'
import { Image, ScrollView, Text, View } from 'react-native'

import { HomeStateItemSearch, isEditingUserPage } from '../../state/home'
import { useOvermind } from '../../state/om'
import { NotFoundPage } from '../NotFoundPage'
import { Toast } from '../Toast'
import { Box } from '../ui/Box'
import { Circle } from '../ui/Circle'
import { Divider } from '../ui/Divider'
import { Icon } from '../ui/Icon'
import { LinkButton } from '../ui/Link'
import { PageTitle } from '../ui/PageTitle'
import { PageTitleTag } from '../ui/PageTitleTag'
import { closeAllPopovers, popoverCloseCbs } from '../ui/Popover'
import { Spacer } from '../ui/Spacer'
import { HStack, VStack, ZStack } from '../ui/Stacks'
import { useWaterfall } from '../ui/useWaterfall'
import { flatButtonStyle } from './baseButtonStyle'
import { CloseButton, SmallCircleButton } from './CloseButton'
import { getTitleForState } from './getTitleForState'
import HomeLenseBar from './HomeLenseBar'
import { LoadingItems } from './LoadingItems'
import { RestaurantListItem } from './RestaurantListItem'

export const avatar = require('../../assets/peach.png')

const verticalPad = 16

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
      {/* <ZStack
        right={6}
        top={6}
        justifyContent="center"
        pointerEvents="auto"
        zIndex={100}
      >
        <HStack spacing="sm" alignItems="center">
          <CloseButton onPress={() => om.actions.home.up()} />
        </HStack>
      </ZStack> */}

      {/*  */}
      <VStack
        paddingTop={verticalPad}
        paddingHorizontal={22}
        position="relative"
        zIndex={100}
      >
        <HStack width="100%">
          <VStack flex={4}>
            <PageTitle
              flex={2}
              subTitle={<HStack spacing={10}>{subTitleElements}</HStack>}
            >
              {pageTitleElements}
            </PageTitle>
          </VStack>

          <VStack alignItems="flex-end" justifyContent="center">
            <HomeLenseBar
              spacer={<Spacer size={9} />}
              relative
              stateIndex={stateIndex}
            />
          </VStack>
        </HStack>
        <Spacer size={verticalPad} />
        <Divider flex />
        <ZStack
          fullscreen
          pointerEvents="none"
          top="auto"
          bottom={-35}
          zIndex={1000}
          height={50}
        >
          <HStack alignItems="center" spacing="sm">
            <Circle size={26} marginVertical={-26 / 2}>
              <Image source={avatar} style={{ width: 26, height: 26 }} />
            </Circle>
            {isEditingUserList && (
              <>
                <LinkButton
                  pointerEvents="auto"
                  {...flatButtonStyle}
                  {...{
                    name: 'search',
                    params: {
                      ...om.state.router.curPage.params,
                      username: '',
                    },
                  }}
                  onPress={() => {
                    Toast.show('Saved')
                  }}
                >
                  <Text>Done</Text>
                </LinkButton>
              </>
            )}
            {!isEditingUserList && (
              <LinkButton
                pointerEvents="auto"
                onPress={() => {
                  om.actions.home.forkCurrentList()
                }}
              >
                <Box
                  padding={3}
                  paddingHorizontal={5}
                  shadowRadius={0}
                  backgroundColor="#fff"
                >
                  <HStack alignItems="center" spacing={6}>
                    <Icon name="Edit2" size={12} color="#777" />
                    <Text style={{ color: 'blue' }}>My list</Text>
                  </HStack>
                </Box>
              </LinkButton>
            )}
          </HStack>
        </ZStack>
      </VStack>

      <VStack
        // marginTop={-23}
        position="relative"
        flex={1}
        // paddingTop={4}
        overflow="hidden"
      >
        <HomeSearchResultsViewContent state={state} />
      </VStack>
    </>
  )
})

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const topPad = 8
    const [fullyLoad, setFullyLoad] = useState(false)

    useWaterfall(() => {
      setFullyLoad(true)
    }, [state.results])

    if (!state.results?.results || state.results.status === 'loading') {
      return (
        <VStack paddingTop={topPad}>
          <LoadingItems />
        </VStack>
      )
    }

    const resultsIds = state.results?.results?.restaurantIds
    const resultsAll = resultsIds.map((id) => allRestaurants[id])
    const results = fullyLoad ? resultsAll : resultsAll.slice(0, 4)

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
      <ScrollView>
        <VStack paddingTop={topPad} paddingBottom={20}>
          {results.map((item, index) => (
            <RestaurantListItem
              currentLocationInfo={state.currentLocationInfo}
              key={item.id}
              restaurant={item}
              rank={index + 1}
            />
          ))}
        </VStack>
      </ScrollView>
    )
    // return (
    //   <List
    //     data={[topPad, ...results, 20]}
    //     estimatedHeight={182}
    //     renderItem={({ item, index }) => {
    //       if (typeof item == 'number') {
    //         return <Spacer size={item} />
    //       }
    //       return (

    //       )
    //     }}
    //   />
    // )
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
