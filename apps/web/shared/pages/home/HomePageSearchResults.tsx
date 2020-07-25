import { createCancellablePromise, idle, series } from '@dish/async'
import {
  Button,
  HStack,
  LoadingItem,
  Spacer,
  StackProps,
  Text,
  VStack,
} from '@dish/ui'
import { pick } from 'lodash'
import React, {
  Suspense,
  SuspenseList,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ArrowUp } from 'react-feather'
import { ScrollView } from 'react-native'

import { searchBarHeight, searchBarTopOffset } from '../../constants'
import { HomeStateItemSearch, OmState } from '../../state/home'
import { isSearchState } from '../../state/home-helpers'
import { omStatic, useOvermind } from '../../state/useOvermind'
import { getTitleForState } from './getTitleForState'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePagePane'
import { HomeScrollView } from './HomeScrollView'
import { focusSearchInput } from './HomeSearchInput'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantListItem } from './RestaurantListItem'
import { useLastValueWhen } from './useLastValueWhen'
import { useMediaQueryIsSmall } from './useMediaQueryIs'

export const avatar = require('../../assets/peach.jpg').default

type Props = HomePagePaneProps<HomeStateItemSearch>

const topBarVPad = 12
const useSpacing = () => {
  const isSmall = useMediaQueryIsSmall()
  const paddingTop = isSmall
    ? topBarVPad
    : searchBarHeight - searchBarTopOffset + topBarVPad + 4
  return {
    paddingTop,
    titleHeight: 61,
    isSmall,
  }
}

const useLastValue = (a: any) => {
  const last = useRef(a)
  return useMemo(() => {
    last.current = a
    return last.current
  }, [a])
}

export default memo(function HomePageSearchResults(props: Props) {
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const om = useOvermind()
  const state = om.state.home.allStates[props.item.id] as HomeStateItemSearch
  const { title, subTitle, pageTitleElements } = getTitleForState(
    om.state,
    state
  )
  // console.log(
  //   'pageTitleElements',
  //   pageTitleElements,
  //   title,
  //   subTitle,
  //   JSON.stringify(state, null, 2),
  //   props.item
  // )

  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  const wasOptimisticUpdating = useLastValue(isOptimisticUpdating)

  const titleElements = useMemo(() => {
    return (
      <>
        <Text ellipse fontSize={15} fontWeight="700">
          {pageTitleElements}
        </Text>
        <Text ellipse opacity={0.5} fontWeight="300" fontSize={15}>
          {subTitle}
        </Text>
      </>
    )
  }, [subTitle, pageTitleElements])

  const changingFilters = wasOptimisticUpdating && state.status === 'loading'
  const shouldAvoidContentUpdates =
    isOptimisticUpdating ||
    props.isRemoving ||
    !props.isActive ||
    changingFilters

  const key = useLastValueWhen(
    () => JSON.stringify(pick(state, 'status', 'id', 'results')),
    shouldAvoidContentUpdates
  )

  const contentInner = useMemo(() => {
    return <SearchResultsContent key={key} {...props} item={state} />
  }, [key])

  const content = useLastValueWhen(
    () => contentInner,
    shouldAvoidContentUpdates
  )

  return (
    <HomeStackDrawer title={title} closable>
      <SearchResultsTitle title={titleElements} stateId={props.item.id} />
      <Suspense fallback={<HomeLoading />}>
        <VStack
          flex={1}
          overflow="hidden"
          opacity={isOptimisticUpdating ? 0.5 : 1}
        >
          {content}
        </VStack>
      </Suspense>
    </HomeStackDrawer>
  )
})

const SearchResultsTitle = memo(
  ({ stateId, title }: { stateId: string; title: any }) => {
    const om = useOvermind()
    const state = om.state.home.allStates[stateId]

    if (!isSearchState(state)) {
      return null
    }

    return (
      <HStack
        position="absolute"
        top={0}
        left={0}
        right={0}
        borderBottomColor="#eee"
        borderBottomWidth={1}
        zIndex={1000}
        alignItems="center"
        backgroundColor="#fff"
        height={62}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <HStack
            paddingVertical={topBarVPad}
            paddingHorizontal={18}
            flex={1}
            justifyContent="space-between"
          >
            <HStack marginTop={-11} alignItems="center" justifyContent="center">
              <HomeLenseBar activeTagIds={state.activeTagIds} />
            </HStack>
            <Spacer size={16} />
            <HomeFilterBar activeTagIds={state.activeTagIds} />
            <Spacer size={16} />
            <VStack
              flex={10}
              spacing={3}
              justifyContent="flex-end"
              alignItems="flex-end"
              overflow="hidden"
            >
              {title}
            </VStack>
          </HStack>
        </ScrollView>
        {/* <MyListButton isEditingUserList={isEditingUserList} /> */}
      </HStack>
    )
  }
)

const SearchResultsContent = memo((props: Props) => {
  const searchState = props.item
  if (!isSearchState(searchState)) {
    console.warn('impossibke')
    return null
  }
  const { isSmall, titleHeight } = useSpacing()
  const paddingTop = isSmall ? 58 : titleHeight - searchBarHeight
  const [state, setState] = useState({
    chunk: 1,
    hasLoaded: 1,
    scrollToEndOf: 1,
    scrollToTop: 0,
  })
  const scrollRef = useRef<ScrollView | null>(null)
  const perChunk = [3, 3, 6, 12, 12]
  const allResults = searchState.results
  const currentlyShowing = Math.min(
    allResults.length,
    state.chunk *
      perChunk.slice(0, state.chunk).reduce((a, b) => a + b, perChunk[0])
  )

  const handleScrollToBottom = useCallback(() => {
    setState((x) => {
      if (x.scrollToEndOf !== x.hasLoaded) {
        console.warn('scroll to bottom, update state')
        return { ...x, scrollToEndOf: x.hasLoaded }
      }
      return x
    })
  }, [])

  useEffect(() => {
    return omStatic.reaction(
      (state) => state.home.activeIndex,
      (index) => {
        if (!omStatic.state.home.hoveredRestaurant) {
          scrollRef.current?.scrollTo({ x: 0, y: 200 * index, animated: true })
        }
      }
    )
  }, [])

  useEffect(() => {
    if (state.scrollToTop > 0) {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    }
  }, [state.scrollToTop])

  const contentWrap = (children: any) => {
    return (
      <HomeScrollView ref={scrollRef} onScrollNearBottom={handleScrollToBottom}>
        <VStack height={paddingTop} />
        <VStack minHeight="40vh">{children}</VStack>
        <SearchFooter
          scrollToTop={() =>
            setState((x) => ({ ...x, scrollToTop: Math.random() }))
          }
          searchState={searchState}
        />
      </HomeScrollView>
    )
  }

  const results = useMemo(() => {
    const cur = allResults.slice(0, currentlyShowing)
    return (
      <SuspenseList revealOrder="forwards">
        {cur.map((result, index) => {
          const onFinishRender =
            index == cur.length - 1
              ? // load more
                () => {
                  setState((x) => ({ ...x, hasLoaded: x.hasLoaded + 1 }))
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
  }, [allResults, currentlyShowing, state.chunk])

  const isOnLastChunk = currentlyShowing === allResults.length
  const isLoading =
    searchState.status === 'loading' ||
    (searchState.results.length === 0
      ? false
      : !isOnLastChunk || state.hasLoaded <= state.chunk)

  // console.log(
  //   'SearchResults',
  //   JSON.stringify(
  //     {
  //       state,
  //       currentlyShowing,
  //       firstResult: JSON.stringify(allResults[0]),
  //       len: results.length,
  //       allLen: allResults.length,
  //       isOnLastChunk,
  //       isLoading,
  //     },
  //     null,
  //     2
  //   )
  // )

  // in an effect so we can use series and get auto-cancel on unmount
  useEffect(() => {
    if (state.hasLoaded <= 1) {
      return
    }
    if (isOnLastChunk) {
      return
    }
    if (state.scrollToEndOf < state.hasLoaded) {
      return
    }

    return series([
      () => isReadyToLoadMore(),
      () => idle(30),
      () => {
        setState((x) => ({ ...x, chunk: x.chunk + 1 }))
      },
    ])

    function isReadyToLoad(s: OmState) {
      console.log('s.home.isScrolling ', s.home.isScrolling)
      return (
        (s.home.currentStateType === 'search' ||
          s.home.currentStateType === 'userSearch') &&
        s.home.isScrolling === false
      )
    }

    function isReadyToLoadMore() {
      return createCancellablePromise((res, _, onCancel) => {
        const reaction = omStatic['reaction']
        const dispose = reaction(
          (state) => isReadyToLoad(state),
          (isReady) => {
            if (!isReady) return
            console.log('ready to load more')
            dispose()
            res()
          }
        )
        onCancel(dispose)
      })
    }
  }, [isOnLastChunk, state.hasLoaded, state.scrollToEndOf])

  if (!isLoading && !allResults.length) {
    return contentWrap(
      <VStack
        margin="auto"
        paddingVertical="10vh"
        alignItems="center"
        justifyContent="center"
        spacing
      >
        <Text fontSize={22}>No results 😞</Text>
        {/* <LinkButton name="contact">Report problem</LinkButton> */}
      </VStack>
    )
  }

  console.warn('SearchContent', { isLoading })

  return contentWrap(
    <VStack paddingBottom={20} spacing={6}>
      {results}
      {isLoading && <HomeLoading />}
    </VStack>
  )
})

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
