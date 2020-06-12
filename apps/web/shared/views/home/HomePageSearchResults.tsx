import { fullyIdle } from '@dish/async'
import {
  Box,
  Circle,
  HStack,
  LoadingItems,
  Text,
  Toast,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useMemo, useState } from 'react'
import { Edit2 } from 'react-feather'
import { Image } from 'react-native'

import { drawerBorderRadius, searchBarHeight } from '../../constants'
import { HomeStateItemSearch, OmState } from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { getTitleForState } from './getTitleForState'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBarOnly } from './HomeLenseBar'
import { HomeScrollView } from './HomeScrollView'
import { RestaurantListItem } from './RestaurantListItem'
import { StackViewCloseButton } from './StackViewCloseButton'

// @ts-ignore

export const avatar = require('../../assets/peach.jpg').default

const paddingTop = searchBarHeight + 12
const titleHeight = searchBarHeight + 12 + 48

export default memo(function HomePageSearchResults(props: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const state = om.state.home.lastSearchState
  // const isEditingUserList = !!isEditingUserPage(om.state)
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

      {/* Title */}
      <HStack
        position="absolute"
        left={0}
        right={0}
        paddingTop={paddingTop}
        height={titleHeight}
        paddingBottom={12}
        paddingHorizontal={18}
        backgroundColor="#fff"
        borderBottomColor="#eee"
        borderBottomWidth={1}
        zIndex={1000}
        overflow="hidden"
        alignItems="center"
      >
        <HStack
          flex={1}
          justifyContent="space-between"
          flexDirection="row-reverse"
          spacing={15}
        >
          <HomeLenseBarOnly activeTagIds={state.activeTagIds} />
          <HomeFilterBar activeTagIds={state.activeTagIds} />
          <VStack flex={1} />
          <VStack spacing={3} alignItems="flex-end" justifyContent="flex-end">
            <Text fontSize={14}>{pageTitleElements}</Text>
            <Text opacity={0.5} fontSize={14}>
              {subTitleElements}
            </Text>
          </VStack>
        </HStack>
        {/* <MyListButton isEditingUserList={isEditingUserList} /> */}
      </HStack>

      <HomeScrollView>
        <VStack height={titleHeight - searchBarHeight} />
        {/* CONTENT */}
        <HomeSearchResultsViewContent state={{ ...state }} />
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

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allResults = state.results?.results?.restaurants ?? []
    const [chunk, setChunk] = useState(1)
    const perChunk = 3
    // load a few at a time, less to start
    const isLoading =
      !state.results?.results || state.results.status === 'loading'

    async function isReadyToLoadMore() {
      const isOnSearch = (s: OmState) => s.home.currentStateType === 'search'
      const isNotScrolling = (s: OmState) => s.home.isScrolling === false
      const isReadyToLoad = (s: OmState) => isOnSearch(s) && isNotScrolling(s)
      if (!isReadyToLoad(omStatic.state)) {
        await new Promise((res) => {
          const dispose = om.reaction(
            // @ts-ignore why?
            (state) => isReadyToLoad(state),
            (isReady) => {
              if (isReady) {
                dispose()
                res()
              }
            }
          )
        })
      }
    }

    const results = useMemo(() => {
      const cur = allResults.slice(0, chunk * perChunk)
      const hasMoreToLoad = cur.length < allResults.length
      return cur.map((item, index) => (
        <Suspense key={item.id} fallback={null}>
          <RestaurantListItem
            currentLocationInfo={state.currentLocationInfo ?? null}
            restaurantId={item.id}
            restaurantSlug={item.slug}
            rank={index + 1}
            searchState={state}
            onFinishRender={
              hasMoreToLoad && index == cur.length - 1
                ? // load more
                  async () => {
                    if (results.length < allResults.length) {
                      await isReadyToLoadMore()
                      await fullyIdle()
                      setChunk((x) => x + 1)
                    }
                  }
                : undefined
            }
          />
        </Suspense>
      ))
    }, [allResults, chunk])

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
          {results}
        </VStack>
      </>
    )
  }
)

// count it as two votes

// const HomePageSearchResultsDishes = memo(
//   graphql(({ state }: { state: HomeStateItemSearch }) => {
//     const om = useOvermind()
//     const activeTags = getActiveTags(om.state.home, state)

//     if (activeTags.some((x) => x.type === 'dish')) {
//       // TODO use a real
//       const dishes = query.tag({
//         limit: 6,
//         where: {
//           type: { _eq: 'dish' },
//         },
//       })

//       return (
//         <HStack paddingHorizontal={20} paddingVertical={10}>
//           {dishes.map((dish) => (
//             <DishView
//               key={dish.name}
//               dish={{
//                 name: dish.name,
//                 // TODO @tom how do we get rating/image here?
//                 image: dish.icon ?? '',
//                 rating: 5,
//                 count: 1,
//               }}
//             />
//           ))}
//         </HStack>
//       )
//     }
//     return null
//   })
// )

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
