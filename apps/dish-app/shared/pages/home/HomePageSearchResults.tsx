import { sleep } from '@dish/async'
import { ArrowUp } from '@dish/react-feather'
import {
  Button,
  HStack,
  LoadingItem,
  Spacer,
  StackProps,
  Text,
  VStack,
} from '@dish/ui'
import { debounce } from 'lodash'
import React, {
  Suspense,
  unstable_SuspenseList as SuspenseList,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ScrollView } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { getTagId } from '../../state/getTagId'
import { isSearchState } from '../../state/home-helpers'
import { getLocationFromRoute } from '../../state/home-location.helpers'
import { getFullTags, getTagsFromRoute } from '../../state/home-tag-helpers'
import {
  HomeActiveTagsRecord,
  HomeStateItemSearch,
} from '../../state/home-types'
import { omStatic, useOvermind } from '../../state/om'
import { router } from '../../state/router'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { getTitleForState } from './getTitleForState'
import { HomeDeliveryFilterButtons } from './HomeDeliveryFilterButtons'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView } from './HomeScrollView'
import { HomeSearchInfoBox } from './HomeSearchInfoBox'
import { focusSearchInput } from './HomeSearchInput'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantListItem } from './RestaurantListItem'
import { useHomeDrawerWidth } from './useHomeDrawerWidth'
import { useLastValue } from './useLastValue'
import { useLastValueWhen } from './useLastValueWhen'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { usePageLoadEffect } from './usePageLoadEffect'

export const avatar = require('../../assets/peach.jpg').default

type Props = HomePagePaneProps<HomeStateItemSearch>

const titleHeight = 52
const topBarVPad = 12

const useSpacing = () => {
  const isSmall = useMediaQueryIsSmall()
  const paddingTop = isSmall
    ? topBarVPad
    : titleHeight - searchBarTopOffset + topBarVPad + 4
  return {
    paddingTop,
    titleHeight,
    isSmall,
  }
}

export default memo(function HomePageSearchResults(props: Props) {
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const om = useOvermind()
  const state = om.state.home.allStates[props.item.id] as HomeStateItemSearch
  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  const wasOptimisticUpdating = useLastValue(isOptimisticUpdating)

  const changingFilters = wasOptimisticUpdating && state.status === 'loading'
  const shouldAvoidContentUpdates =
    isOptimisticUpdating || !props.isActive || changingFilters

  usePageLoadEffect(props.isActive, ({ isRefreshing }) => {
    console.log('load search', isRefreshing)
    // if initial load on a search page, process url => state
    let isCancelled = false
    if (!isRefreshing) {
      const fakeTags = getTagsFromRoute(router.curPage)
      const location = getLocationFromRoute()
      // TODO UPDATE HOME TOO...
      om.actions.home.updateCurrentState({
        ...state,
        ...location,
      })
      getFullTags(fakeTags).then((tags) => {
        if (isCancelled) return
        om.actions.home.addTagsToCache(tags)
        const activeTagIds: HomeActiveTagsRecord = tags.reduce<any>(
          (acc, tag) => {
            acc[getTagId(tag)] = true
            return acc
          },
          {}
        )
        om.actions.home.updateActiveTags({
          ...state,
          searchQuery: decodeURIComponent(router.curPage.params.search ?? ''),
          activeTagIds,
        })
        om.actions.home.runSearch()
      })
    } else {
      om.actions.home.runSearch({ force: true })
    }
    return () => {
      isCancelled = true
    }
  })

  useEffect(() => {
    let isCancelled = false
    const dispose = om.reaction(
      () => om.state.home.selectedRestaurant,
      async ({ id }) => {
        const restaurants = props.item.results
        const index = restaurants.findIndex((x) => x.id === id)
        if (index > -1) {
          await sleep(300)
          if (!isCancelled) {
            om.actions.home.setActiveIndex({
              index,
              event: om.state.home.isHoveringRestaurant ? 'hover' : 'pin',
            })
          }
        }
      }
    )
    return () => {
      isCancelled = true
      dispose()
    }
  })

  const key = useLastValueWhen(
    () =>
      JSON.stringify({
        status: state.status,
        id: state.id,
        results: state.results.map((x) => x.id),
      }),
    shouldAvoidContentUpdates
  )

  const content = useMemo(() => {
    return <SearchResultsContent {...props} item={state} />
  }, [key])

  return (
    <HomeStackDrawer closable>
      <SearchResultsTopBar stateId={props.item.id} />
      <Suspense fallback={<HomeLoading />}>
        <VStack
          flex={1}
          overflow="hidden"
          opacity={isOptimisticUpdating ? 0.5 : 1}
          width="100%"
        >
          {content}
        </VStack>
      </Suspense>
    </HomeStackDrawer>
  )
})

const SearchResultsTopBar = memo(({ stateId }: { stateId: string }) => {
  const om = useOvermind()
  const state = om.state.home.allStates[stateId]
  const drawerWidth = useHomeDrawerWidth()
  console.log('drawerWidth', drawerWidth)

  if (!isSearchState(state)) {
    return null
  }

  return (
    <VStack
      position="absolute"
      top={0}
      left={0}
      right={0}
      borderBottomColor="#eee"
      backgroundColor="#fff"
      borderBottomWidth={1}
      shadowColor="rgba(0,0,0,0.1)"
      shadowRadius={10}
      zIndex={1000}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%', minWidth: '100%' }}
        contentContainerStyle={{
          minWidth: drawerWidth - 20,
          maxWidth: drawerWidth - 20,
        }}
      >
        <VStack
          alignItems="center"
          height={titleHeight}
          overflow="hidden"
          width="100%"
          maxWidth="100%"
          minWidth="100%"
          paddingHorizontal={12}
        >
          <HStack
            paddingVertical={topBarVPad}
            paddingHorizontal={18}
            width="100%"
            alignItems="center"
            overflow="hidden"
            justifyContent="space-between"
          >
            <HStack marginTop={-18} alignItems="center" justifyContent="center">
              <HomeLenseBar activeTagIds={state.activeTagIds} />
            </HStack>

            <VStack flex={1} width={16} />

            <HomeFilterBar activeTagIds={state.activeTagIds} />
          </HStack>
        </VStack>

        <HomeDeliveryFilterButtons activeTagIds={state.activeTagIds} />
      </ScrollView>
    </VStack>
  )
})

const getRestaurantListItemHeight = () => {
  const items = Array.from(document.querySelectorAll('.restaurant-list-item'))
  if (items.length) {
    return (
      items.reduce((a, b) => a + Math.max(220, b.clientHeight), 0) /
      items.length
    )
  }
  return 280
}

const SearchResultsContent = (props: Props) => {
  const searchState = props.item
  const { isSmall, titleHeight } = useSpacing()
  const paddingTop = isSmall ? titleHeight : titleHeight - searchBarHeight + 2
  const perChunk = 4
  const allResults = searchState.results
  const total = allResults.length
  const totalChunks = Math.ceil(total / perChunk)
  const [state, setState] = useState({
    chunk: 1,
    hasLoaded: 1,
    itemHeightAvg: getRestaurantListItemHeight(),
    scrollToTop: 0,
  })
  const isOnLastChunk = totalChunks === state.chunk
  const scrollRef = useRef<ScrollView | null>(null)
  const totalLoading = Math.min(total, state.chunk * perChunk)
  const totalLeftToLoad = total - totalLoading
  const isLoading =
    searchState.status === 'loading' ||
    (searchState.results.length === 0
      ? false
      : !isOnLastChunk || state.hasLoaded <= state.chunk)

  const handleScrollY = (y: number) => {
    if (isOnLastChunk) return
    const estEndY = state.itemHeightAvg * totalLoading
    const estLoadY = estEndY - window.innerHeight * 0.5
    if (y > estLoadY) {
      setState((x) => ({ ...x, chunk: x.chunk + 1 }))
    }
  }

  useEffect(() => {
    return omStatic.reaction(
      (state) => state.home.activeIndex,
      (index) => {
        console.log(
          'active index',
          index,
          omStatic.state.home.activeEvent,
          scrollRef.current
        )
        if (
          omStatic.state.home.activeEvent === 'pin' ||
          omStatic.state.home.activeEvent === 'key'
        ) {
          const height = getRestaurantListItemHeight()
          scrollRef.current?.scrollTo({
            x: 0,
            y: height * index,
            animated: true,
          })
        }
      }
    )
  }, [])

  useEffect(() => {
    if (state.scrollToTop > 0) {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    }
  }, [state.scrollToTop])

  const { title, subTitle, pageTitleElements } = getTitleForState(searchState, {
    lowerCase: false,
  })

  const titleLen = (title + subTitle).length
  const titleScale =
    titleLen > 70 ? 0.7 : titleLen > 60 ? 0.8 : titleLen > 50 ? 0.9 : 1
  const titleFontSize = 30 * titleScale * (isSmall ? 0.75 : 1)

  const contentWrap = (children: any) => {
    return (
      <HomeScrollView
        ref={scrollRef}
        onScrollYThrottled={isOnLastChunk ? null : handleScrollY}
      >
        <VStack height={paddingTop} />
        <PageTitleTag>{title}</PageTitleTag>
        <HStack
          justifyContent="center"
          paddingHorizontal={20}
          paddingTop={20}
          paddingBottom={15}
          overflow="hidden"
        >
          <Text
            letterSpacing={-0.5}
            ellipse
            fontSize={titleFontSize}
            fontWeight="600"
          >
            {pageTitleElements}{' '}
            <Text
              // fontSize={titleFontSize * 0.9}
              fontWeight="300"
              opacity={0.5}
            >
              {subTitle}
            </Text>
          </Text>
        </HStack>
        <Suspense fallback={null}>
          <HomeSearchInfoBox state={searchState} />
        </Suspense>
        <VStack>{children}</VStack>
        <Suspense fallback={null}>
          <SearchFooter
            scrollToTop={() =>
              setState((x) => ({ ...x, scrollToTop: Math.random() }))
            }
            searchState={searchState}
          />
        </Suspense>
      </HomeScrollView>
    )
  }

  const results = useMemo(() => {
    const cur = allResults.slice(0, totalLoading)
    return (
      <SuspenseList revealOrder="forwards">
        {cur.map((result, index) => {
          const onFinishRender =
            index == cur.length - 1
              ? // load more
                () => {
                  setState((x) => ({
                    ...x,
                    hasLoaded: x.hasLoaded + 1,
                    itemHeightAvg: getRestaurantListItemHeight(),
                  }))
                }
              : undefined
          return (
            <Suspense key={result.id} fallback={<LoadingItem />}>
              <RestaurantListItem
                currentLocationInfo={searchState.currentLocationInfo ?? null}
                restaurantId={result.id}
                restaurantSlug={result.slug}
                rank={index + 1}
                searchState={searchState}
                onFinishRender={onFinishRender}
              />
            </Suspense>
          )
        })}
      </SuspenseList>
    )
  }, [allResults, totalLoading, state.chunk])

  if (!isLoading && !total) {
    return contentWrap(
      <VStack
        margin="auto"
        paddingVertical="10vh"
        alignItems="center"
        justifyContent="center"
        spacing
      >
        <Text fontSize={22}>No results</Text>
        <Text>😞</Text>
        {/* <LinkButton name="contact">Report problem</LinkButton> */}
      </VStack>
    )
  }

  return contentWrap(
    <VStack paddingBottom={20} spacing={6}>
      {results}
      <VStack minHeight={totalLeftToLoad * state.itemHeightAvg}>
        {isLoading && <HomeLoading />}
      </VStack>
    </VStack>
  )
}

const SearchFooter = ({
  searchState,
  scrollToTop,
}: {
  searchState: HomeStateItemSearch
  scrollToTop: Function
}) => {
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      width="100%"
    >
      <HStack alignItems="center" justifyContent="center">
        <HomeLenseBar size="lg" activeTagIds={searchState.activeTagIds} />
      </HStack>
      <Spacer size={40} />
      <Button
        alignSelf="center"
        onPress={() => {
          if (omStatic.state.home.isAutocompleteActive) {
            scrollToTop()
          } else {
            focusSearchInput()
          }
        }}
      >
        <ArrowUp />
      </Button>
      <Spacer size={40} />
      <Text opacity={0.5} fontSize={12}>
        Showing {searchState.results.length} / {searchState.results.length}{' '}
        results
      </Text>
    </VStack>
  )
}

const HomeLoading = (props: StackProps) => {
  return (
    <VStack flex={1} width="100%" minHeight={300} {...props}>
      <LoadingItem />
    </VStack>
  )
}

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
//   return isMounted
//     ? props.children
//     : props.loading ?? <View style={{ height: props.estimatedHeight }} />
// }

// const MyListButton = memo(
//   ({ isEditingUserList }: { isEditingUserList: boolean }) => {
//     const om = useOvermind()
//     return (
//       <HStack alignItems="center" spacing="sm">
//         <Circle size={26} marginVertical={-26 / 2}>
//           <Image source={avatar} style={{ width: 26, height: 26 }} />
//         </Circle>
//         {isEditingUserList && (
//           <>
//             <LinkButton
//               pointerEvents="auto"
//               {...flatButtonStyle}
//               {...{
//                 name: 'search',
//                 params: {
//                   ...om.state.router.curPage.params,
//                   username: '',
//                 },
//               }}
//               onPress={() => {
//                 Toast.show('Saved')
//               }}
//             >
//               <Text>Done</Text>
//             </LinkButton>
//           </>
//         )}
//         {!isEditingUserList && (
//           <LinkButton
//             pointerEvents="auto"
//             onPress={() => {
//               om.actions.home.forkCurrentList()
//             }}
//           >
//             <Box padding={5} paddingHorizontal={5} backgroundColor="#fff">
//               <HStack alignItems="center" spacing={6}>
//                 <Edit2 size={12} color="#777" />
//                 <Text color="inherit" fontSize={16} fontWeight="700">
//                   My list
//                 </Text>
//               </HStack>
//             </Box>
//           </LinkButton>
//         )}
//       </HStack>
//     )
//   }
// )
