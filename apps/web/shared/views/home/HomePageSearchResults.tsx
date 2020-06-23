import { fullyIdle, series } from '@dish/async'
import {
  Box,
  Circle,
  HStack,
  LoadingItems,
  Spacer,
  Text,
  Toast,
  VStack,
} from '@dish/ui'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Edit2 } from 'react-feather'
import { Image } from 'react-native'

import {
  drawerBorderRadius,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { HomeStateItemSearch, OmState } from '../../state/home'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../ui/LinkButton'
import { PageTitleTag } from '../ui/PageTitleTag'
import { flatButtonStyle } from './baseButtonStyle'
import { getTitleForState } from './getTitleForState'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBar } from './HomeLenseBar'
import { HomeScrollView } from './HomeScrollView'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RestaurantListItem } from './RestaurantListItem'
import { StackViewCloseButton } from './StackViewCloseButton'

// @ts-ignore

export const avatar = require('../../assets/peach.jpg').default

export default memo(function HomePageSearchResults(props: {
  state: HomeStateItemSearch
}) {
  const om = useOvermind()
  const state = om.state.home.lastSearchState ?? props.state
  const isSmall = useMediaQueryIsSmall()
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const { title, subTitle, pageTitleElements } = getTitleForState(
    om.state,
    state
  )
  const topBarVPad = 12
  const paddingTop = isSmall
    ? topBarVPad
    : searchBarHeight - searchBarTopOffset + topBarVPad
  const titleHeight = paddingTop + 48

  console.warn('HomePageSearchResults.render')

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
        top={0}
        left={0}
        right={0}
        paddingTop={paddingTop}
        paddingBottom={topBarVPad}
        height={titleHeight}
        paddingHorizontal={18}
        backgroundColor="#fff"
        borderBottomColor="#eee"
        borderBottomWidth={1}
        zIndex={1000}
        alignItems="center"
      >
        <HStack
          flex={1}
          justifyContent="space-between"
          flexDirection="row-reverse"
          spacing={15}
        >
          <VStack marginTop={12} marginBottom={-20}>
            <HomeLenseBar activeTagIds={state.activeTagIds} />
          </VStack>
          <HomeFilterBar activeTagIds={state.activeTagIds} />
          <VStack
            flex={10}
            alignSelf="flex-end"
            spacing={3}
            alignItems="flex-end"
            justifyContent="flex-end"
            overflow="hidden"
          >
            <Text ellipse fontSize={15} fontWeight="700">
              {pageTitleElements}
            </Text>
            <Text ellipse opacity={0.5} fontWeight="300" fontSize={15}>
              {subTitle}
            </Text>
          </VStack>
        </HStack>
        {/* <MyListButton isEditingUserList={isEditingUserList} /> */}
      </HStack>

      <HomeScrollView>
        <VStack height={isSmall ? 58 : titleHeight - searchBarHeight} />
        {/* CONTENT */}
        <HomeSearchResultsViewContent state={{ ...state }} />
      </HomeScrollView>
    </VStack>
  )
})

const HomeSearchResultsViewContent = memo(
  ({ state }: { state: HomeStateItemSearch }) => {
    const om = useOvermind()
    const allResults = state.results?.results?.restaurants ?? []
    const [chunk, setChunk] = useState(1)
    const [loadMore, setLoadMore] = useState(0)
    const perChunk = [0, 3, 3, 6, 12, 12]
    const totalToShow = chunk * perChunk[chunk]
    const hasMoreToLoad = allResults.length > totalToShow
    // load a few at a time, less to start
    const loadMoreCb = useCallback(() => setLoadMore(Date.now()), [])
    const isLoading =
      (hasMoreToLoad && loadMore === 0) ||
      !state.results?.results ||
      state.results.status === 'loading'

    const results = useMemo(() => {
      const cur = allResults.slice(0, totalToShow)
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
                  loadMoreCb
                : undefined
            }
          />
        </Suspense>
      ))
    }, [allResults, chunk])

    // in an effect so we can use series and get auto-cancel on unmount
    useEffect(() => {
      if (loadMore !== 0) {
        if (results.length < allResults.length) {
          return series([
            () => isReadyToLoadMore(),
            () => fullyIdle({ min: 100 }),
            () => {
              setChunk((x) => x + 1)
            },
          ])

          async function isReadyToLoadMore() {
            const isOnSearch = (s: OmState) =>
              s.home.currentStateType === 'search'
            const isNotScrolling = (s: OmState) => s.home.isScrolling === false
            const isReadyToLoad = (s: OmState) =>
              isOnSearch(s) && isNotScrolling(s)
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
        }
      }
    }, [loadMore])

    if (isLoading) {
      return (
        <VStack>
          <LoadingItems />
          <VStack display="none">{results}</VStack>
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
          <LinkButton name="contact">Report problem</LinkButton>
        </VStack>
      )
    }

    const isLoadingMore = chunk > 1 && results.length < allResults.length

    return (
      <>
        <VStack paddingBottom={20} spacing={6}>
          {results}
          {isLoadingMore && (
            <VStack flex={1} width="100%" minHeight={400}>
              <LoadingItems />
            </VStack>
          )}
          {!isLoading && !isLoadingMore && (
            <VStack alignItems="center" justifyContent="center" minHeight={300}>
              <Text fontSize={12} opacity={0.5}>
                End of results (for now)
              </Text>
            </VStack>
          )}
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
