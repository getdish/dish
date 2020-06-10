import { requestIdle, series, sleep } from '@dish/async'
import { graphql, query } from '@dish/graph'
import {
  Box,
  Circle,
  HStack,
  LoadingItems,
  PageTitle,
  Spacer,
  Text,
  Toast,
  VStack,
  ZStack,
  useWaterfall,
} from '@dish/ui'
import React, { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Edit2 } from 'react-feather'
import { Image, ScrollView, View } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemSearch, isEditingUserPage } from '../../state/home'
import { getActiveTags } from '../../state/home-tag-helpers'
import { useOvermind } from '../../state/useOvermind'
import { NotFoundPage } from '../NotFoundPage'
import { LinkButton } from '../ui/LinkButton'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { DishView } from './DishView'
import { getTitleForState } from './getTitleForState'
import HomeLenseBar from './HomeLenseBar'
import { HomeScrollView } from './HomeScrollView'
import { RestaurantListItem } from './RestaurantListItem'
import { StackViewCloseButton } from './StackViewCloseButton'

// @ts-ignore

export const avatar = require('../../assets/peach.jpg').default

export default memo(function HomePageSearchResults({
  state,
}: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const isEditingUserList = !!isEditingUserPage(om.state)
  const { title, subTitleElements, pageTitleElements } = getTitleForState(
    om.state,
    state
  )

  return (
    <VStack
      flex={1}
      borderRadius={drawerBorderRadius}
      position="relative"
      backgroundColor="#fff"
      overflow="hidden"
    >
      <PageTitleTag>{title}</PageTitleTag>

      <StackViewCloseButton />

      <HomeScrollView>
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
                state={state}
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
      </HomeScrollView>
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
                <Text color="inherit" fontSize={16} fontWeight="700">
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
    const resultsIds = state.results?.results?.restaurantIds ?? []
    const resultsAll = resultsIds.map((id) => allRestaurants[id])
    const [chunk, setChunk] = useState(1)
    const perChunk = Math.ceil(resultsAll.length / chunks)
    const results = resultsAll.slice(0, chunk * perChunk)
    const loadNextChunk = useCallback(() => {
      console.warn('TODO loading next chunk')
      // setChunk((x) => x + 1)
    }, [])

    // load a few at a time, less to start
    const isLoading =
      !state.results?.results ||
      state.results.status === 'loading' ||
      results[0]?.name === null
    const hasMoreToLoad = results.length < resultsAll.length

    console.log(
      '123 HomeSearchResultsViewContent.render',
      chunk,
      perChunk,
      state.results,
      isLoading
    )

    if (isLoading) {
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
          <Text fontSize={22}>No results 😞</Text>
          <LinkButton name="contact">Send us the address</LinkButton>
        </VStack>
      )
    }

    return (
      <>
        {/* todo fallback can be height if we know its a dish */}
        {/* <Suspense fallback={null}>
          <HomePageSearchResultsDishes state={state} />
        </Suspense> */}
        <VStack paddingBottom={20} spacing={14}>
          {/* <SuspenseList revealOrder="forwards"> */}
          {results.map((item, index) => (
            <Suspense key={item.id} fallback={null}>
              <RestaurantListItem
                currentLocationInfo={state.currentLocationInfo ?? null}
                restaurant={item}
                rank={index + 1}
                searchState={state}
                onFinishRender={
                  hasMoreToLoad && index == results.length - 1
                    ? loadNextChunk
                    : undefined
                }
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

// count it as two votes

const HomePageSearchResultsDishes = memo(
  graphql(({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const activeTags = getActiveTags(om.state.home, state)

    if (activeTags.some((x) => x.type === 'dish')) {
      // TODO use a real
      const dishes = query.tag({
        limit: 6,
        where: {
          type: { _eq: 'dish' },
        },
      })

      return (
        <HStack paddingHorizontal={20} paddingVertical={10}>
          {dishes.map((dish) => (
            <DishView
              key={dish.name}
              dish={{
                name: dish.name,
                // TODO @tom how do we get rating/image here?
                image: dish.icon ?? '',
                rating: 5,
                count: 1,
              }}
            />
          ))}
        </HStack>
      )
    }
    return null
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

// function ListItem(props) {
//   const [isMounted, setIsMounted] = useState(false)
//   useWaterfall(() => {
//     setIsMounted(true)
//   })
//   return isMounted
//     ? props.children
//     : props.loading ?? <View style={{ height: props.estimatedHeight }} />
// }
