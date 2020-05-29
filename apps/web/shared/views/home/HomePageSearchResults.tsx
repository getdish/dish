import { requestIdle, series, sleep } from '@dish/async'
import { graphql, query } from '@dish/graph'
import {
  Box,
  Circle,
  Divider,
  HStack,
  LoadingItems,
  PageTitle,
  Spacer,
  Toast,
  VStack,
  ZStack,
  useWaterfall,
} from '@dish/ui'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Edit2 } from 'react-feather'
import { Image, ScrollView, Text, View } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemSearch, isEditingUserPage } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { LinkButton } from '../ui/LinkButton'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { DishView as MenuItemView } from './DishView'
import { getTitleForState } from './getTitleForState'
import HomeLenseBar from './HomeLenseBar'
import { RestaurantListItem } from './RestaurantListItem'

// @ts-ignore

export const avatar = require('../../assets/peach.jpg').default

export default memo(function HomePageSearchResults({
  stateIndex,
}: {
  stateIndex: number
}) {
  const om = useOvermind()
  const state = om.state.home.states[stateIndex] as HomeStateItemSearch

  if (!state) {
    return <NotFoundPage />
  }

  const isEditingUserList = !!isEditingUserPage(om.state)
  const { title, subTitleElements, pageTitleElements } = getTitleForState(
    om.state,
    state
  )

  return (
    <VStack
      flex={1}
      zIndex={100}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
      overflow="hidden"
    >
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

      <ScrollView>
        {/* Title */}
        <VStack
          paddingTop={26}
          paddingBottom={12}
          paddingHorizontal={22}
          backgroundColor="#fff"
          borderTopLeftRadius={drawerBorderRadius}
          borderTopRightRadius={drawerBorderRadius}
          overflow="hidden"
        >
          <HStack width="100%">
            <VStack flex={4}>
              <PageTitle subTitle={subTitleElements}>
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

          <ZStack
            fullscreen
            pointerEvents="none"
            top="auto"
            bottom={-30}
            right={-98}
            zIndex={1000}
            height={50}
            alignItems="flex-end"
          >
            <MyListButton isEditingUserList={isEditingUserList} />
          </ZStack>
        </VStack>

        {/* CONTENT */}
        <HomeSearchResultsViewContent state={state} />
      </ScrollView>
    </VStack>
  )
})

const MyListButton = memo(
  ({ isEditingUserList }: { isEditingUserList: boolean }) => {
    const om = useOvermind()
    return (
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
            <Box padding={5} paddingHorizontal={5} backgroundColor="#fff">
              <HStack alignItems="center" spacing={6}>
                <Edit2 size={12} color="#777" />
                <Text
                  style={{
                    color: 'inherit',
                    fontSize: 16,
                    fontWeight: '700',
                  }}
                >
                  My list
                </Text>
              </HStack>
            </Box>
          </LinkButton>
        )}
      </HStack>
    )
  }
)

const chunks = 4

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allRestaurants = om.state.home.allRestaurants
    const topPad = 0

    const resultsIds = state.results?.results?.restaurantIds ?? []
    const resultsAll = resultsIds.map((id) => allRestaurants[id])
    const [chunk, setChunk] = useState(1)
    const perChunk = Math.ceil(resultsAll.length / chunks)
    const results = resultsAll.slice(0, chunk * perChunk)

    console.log('HomeSearchResultsViewContent.render', chunk, perChunk)

    // load a few at a time, less to start
    const isLoading = results[0]?.name == null
    const hasMoreToLoad = results.length < resultsAll.length

    // stagger results in as they load/render
    useEffect(() => {
      if (isLoading) return
      if (!hasMoreToLoad) return
      return series([
        () => sleep(250),
        () => requestIdle(),
        () => sleep(100),
        () => requestIdle(),
        // then load next chunk
        () => {
          setChunk((x) => x + 1)
        },
      ])
    }, [isLoading, chunk, hasMoreToLoad])

    if (!state.results?.results || state.results.status === 'loading') {
      return (
        <VStack>
          <LoadingItems />
        </VStack>
      )
    }

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
      <>
        <HomePageSearchResultsDishes state={state} />
        <VStack paddingBottom={20} spacing={14}>
          {/* <SuspenseList revealOrder="forwards"> */}
          {results.map((item, index) => (
            <Suspense key={item.id} fallback={null}>
              <RestaurantListItem
                currentLocationInfo={state.currentLocationInfo ?? null}
                restaurant={item}
                rank={index + 1}
              />
            </Suspense>
          ))}
          {/* </SuspenseList> */}
        </VStack>
      </>
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

const HomePageSearchResultsDishes = memo(
  graphql(({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const activeTags = getActiveTags(om.state.home, state)

    if (activeTags.some((tag) => tag.type !== 'country')) {
      return null
    }

    // TODO use a real
    const menu_items = query.menu_item({
      limit: 6,
    })

    console.log('got menu_items', menu_items)

    return (
      <>
        {menu_items.map((menu_item) => (
          <MenuItemView
            key={menu_item.name}
            dish={{
              name: menu_item.name,
              image: menu_item.image ?? '',
              rating: 5,
              count: 1,
            }}
          />
        ))}
      </>
    )
  })
)

// function List(props: {
//   data: any[]
//   estimatedHeight?: number
//   renderItem: (arg: { item: any; index: number }) => React.ReactNode
// }) {
//   // TODO suspense or flatlist depending for now simple waterfall
//   return (
//     <ScrollView
//       onScroll={() => {
//         if (popoverCloseCbs.size) {
//           closeAllPopovers()
//         }
//       }}
//     >
//       {props.data.map((item, index) => (
//         <ListItem
//           estimatedHeight={props.estimatedHeight}
//           key={item.id ?? index}
//         >
//           {props.renderItem({ item, index })}
//         </ListItem>
//       ))}
//     </ScrollView>
//   )
// }

function ListItem(props) {
  const [isMounted, setIsMounted] = useState(false)
  useWaterfall(() => {
    setIsMounted(true)
  })
  return isMounted
    ? props.children
    : props.loading ?? <View style={{ height: props.estimatedHeight }} />
}
