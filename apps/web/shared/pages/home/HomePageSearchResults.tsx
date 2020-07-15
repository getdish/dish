import { createCancellablePromise, idle, series } from '@dish/async'
import { Button, HStack, LoadingItems, Spacer, Text, VStack } from '@dish/ui'
import { cloneDeep } from 'lodash'
import React, {
  Suspense,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ArrowUp } from 'react-feather'
import { ScrollView } from 'react-native'

import {
  drawerBorderRadius,
  searchBarHeight,
  searchBarTopOffset,
} from '../../constants'
import { weakKey } from '../../helpers/weakKey'
import { HomeStateItemSearch, OmState } from '../../state/home'
import { useOvermind, useOvermindStatic } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { getTitleForState } from './getTitleForState'
import HomeFilterBar from './HomeFilterBar'
import { HomeLenseBar } from './HomeLenseBar'
import { HomePagePaneProps } from './HomePage'
import { HomeScrollView } from './HomeScrollView'
import { focusSearchInput } from './HomeSearchInput'
import { useMediaQueryIsSmall } from './HomeViewDrawer'
import { RestaurantListItem } from './RestaurantListItem'
import { StackViewCloseButton } from './StackViewCloseButton'
import { useLastValueWhen } from './useLastValueWhen'

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
    titleHeight: paddingTop + 48,
    isSmall,
  }
}

export default memo((props: Props) => {
  const om = useOvermind()
  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const { title } = getTitleForState(useOvermindStatic().state, props.item)
  const content = useLastValueWhen(() => {
    const key = weakKey(props.item)
    console.log('content key is', key, cloneDeep(props.item))
    return <SearchResultsContent key={key} {...props} />
  }, isOptimisticUpdating)

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
      <SearchResultsTitle {...props} />
      {content}
    </VStack>
  )
})

const SearchResultsTitle = memo(({ item }: Props) => {
  const { paddingTop, titleHeight } = useSpacing()
  const { subTitle, pageTitleElements } = getTitleForState(
    useOvermindStatic().state,
    item
  )
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
          paddingTop={paddingTop}
          paddingBottom={topBarVPad}
          height={titleHeight}
          paddingHorizontal={18}
          flex={1}
          justifyContent="space-between"
        >
          <HStack marginTop={-14} alignItems="center" justifyContent="center">
            <HomeLenseBar activeTagIds={item.activeTagIds} />
          </HStack>
          <Spacer size={16} />
          <HomeFilterBar activeTagIds={item.activeTagIds} />
          <Spacer size={16} />
          <VStack
            flex={10}
            spacing={3}
            justifyContent="flex-end"
            alignItems="flex-end"
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
      </ScrollView>
      {/* <MyListButton isEditingUserList={isEditingUserList} /> */}
    </HStack>
  )
})

const SearchResultsContent = memo((props: Props) => {
  const { item } = props
  const { isSmall, titleHeight } = useSpacing()
  const paddingTop = isSmall ? 58 : titleHeight - searchBarHeight
  const om = useOvermind()
  const [state, setState] = useState({
    chunk: 1,
    hasLoaded: 1,
    scrollToEndOf: 1,
    scrollToTop: 0,
  })
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const perChunk = [3, 3, 6, 12, 12]
  const allResults = item.results?.results?.restaurants ?? []
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
    if (state.scrollToTop > 0) {
      scrollRef.current?.scrollTo(0, 0)
    }
  }, [state.scrollToTop])

  const contentWrap = (children: any) => {
    return (
      <HomeScrollView ref={scrollRef} onScrollNearBottom={handleScrollToBottom}>
        <VStack height={paddingTop} />
        {children}
      </HomeScrollView>
    )
  }

  const results = useMemo(() => {
    const cur = allResults.slice(0, currentlyShowing)
    return cur.map((result, index) => {
      const onFinishRender =
        index == cur.length - 1
          ? // load more
            () => {
              setState((x) => ({ ...x, hasLoaded: x.hasLoaded + 1 }))
            }
          : undefined
      return (
        <Suspense key={result.id} fallback={null}>
          <RestaurantListItem
            currentLocationInfo={item.currentLocationInfo ?? null}
            restaurantId={result.id}
            restaurantSlug={result.slug}
            rank={index + 1}
            searchState={item}
            onFinishRender={onFinishRender}
          />
        </Suspense>
      )
    })
  }, [allResults, currentlyShowing, state.chunk])

  const isOnLastChunk = currentlyShowing === allResults.length
  const isLoading =
    !isOnLastChunk ||
    !item.results?.results ||
    item.results.status === 'loading' ||
    state.hasLoaded <= state.chunk

  if (process.env.NODE_ENV === 'development') {
    console.log(
      'SearchResults',
      JSON.stringify(
        {
          state,
          currentlyShowing,
          len: results.length,
          allLen: allResults.length,
          isOnLastChunk,
          isLoading,
        },
        null,
        2
      )
    )
  }

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
        const dispose = om.reaction(
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

  if (!results.length) {
    return contentWrap(
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

  return contentWrap(
    <>
      <VStack paddingBottom={20} spacing={6}>
        {results}
        {isLoading && (
          <VStack flex={1} width="100%" minHeight={400}>
            <LoadingItems />
          </VStack>
        )}
        {!isLoading && (
          <VStack
            alignItems="center"
            justifyContent="center"
            minHeight={300}
            width="100%"
          >
            <HStack alignItems="center" justifyContent="center">
              <HomeLenseBar size="lg" activeTagIds={item.activeTagIds} />
            </HStack>
            <Spacer size={40} />
            <Button
              onPress={() => {
                if (om.state.home.isAutocompleteActive) {
                  setState((x) => ({ ...x, scrollToTop: Math.random() }))
                } else {
                  focusSearchInput()
                }
              }}
            >
              <ArrowUp />
            </Button>
            <Spacer size={40} />
            <Text opacity={0.5} fontSize={12}>
              Showing {results.length} / {allResults.length} results
            </Text>
          </VStack>
        )}
      </VStack>
    </>
  )
})

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
