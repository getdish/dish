import { series, sleep } from '@dish/async'
import { RestaurantSearchItem, slugify } from '@dish/graph'
import { ArrowUp } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import { reaction } from '@dish/use-store'
import React, {
  Suspense,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react'
import { LayoutRectangle, ScrollView, ScrollViewProps, View } from 'react-native'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'
import {
  AbsoluteVStack,
  Button,
  HStack,
  LoadingItem,
  Paragraph,
  Spacer,
  StackProps,
  Text,
  VStack,
  combineRefs,
  useLayout,
  useMedia,
} from 'snackui'

import { isWeb } from '../../../constants/constants'
import { addTagsToCache, allTags } from '../../../helpers/allTags'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { getFullTagsFromRoute } from '../../../helpers/syncStateFromRoute'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { appMapStore, useSetAppMap } from '../../AppMap'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useLastValue } from '../../hooks/useLastValue'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { RootPortalItem } from '../../Portal'
import { ContentScrollView } from '../../views/ContentScrollView'
import { PageHead } from '../../views/PageHead'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeSuspense } from '../HomeSuspense'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { ITEM_HEIGHT, RestaurantListItem } from '../restaurant/RestaurantListItem'
import { SearchHeader } from './SearchHeader'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { getSearchPageStore, setStore, useSearchPageStore } from './SearchPageStore'
import { SearchProps } from './SearchProps'
import { useLocationFromRoute } from './useLocationFromRoute'

export default memo(function SearchPage(props: SearchProps) {
  const state = useHomeStateById<HomeStateItemSearch>(props.item.id)
  const searchPageStore = useSearchPageStore({
    id: props.item.id,
  })
  const { title } = getTitleForState(state, {
    lowerCase: true,
  })
  const route = useLastValueWhen<HistoryItem<'search'>>(
    // @ts-expect-error
    () => router.curPage,
    router.curPage.name !== 'search'
  )

  useLayoutEffect(() => {
    if (!props.isActive) return
    setStore(searchPageStore)
  }, [props.isActive])

  useEffect(() => {
    let id = 0
    return reaction(
      appMapStore,
      (x) => x.currentPosition,
      async () => {
        const curId = ++id
        if (homeStore.currentState.id !== props.item.id) {
          return
        }
        // react to current position
        appMapStore.currentPosition
        const next = await appMapStore.getCurrentLocationInfo()
        if (!next || curId !== id) {
          return
        }
        homeStore.updateCurrentState('SearchPage.updateCurrentLocation', {
          curLocInfo: next.curLocInfo,
          curLocName: next.curLocName,
        })
      }
    )
  }, [])

  return (
    <>
      <PageHead isActive={props.isActive}>{title}</PageHead>
      <StackDrawer closable>
        <HomeSuspense>
          <SearchNavBarContainer isActive={props.isActive} />
        </HomeSuspense>
        <HomeSuspense fallback={<SearchLoading />}>
          <SearchPageContent
            key={state.id + JSON.stringify([state.activeTags, state.searchQuery, state.region])}
            {...props}
            route={route}
            item={state}
          />
        </HomeSuspense>
      </StackDrawer>
    </>
  )
})

const SearchPageContent = memo(function SearchPageContent(
  props: SearchProps & { route: HistoryItem<'search'> }
) {
  const { item } = props
  const location = useLocationFromRoute(props.route)
  const tags = useTagsFromRoute(props.route)
  const searchPageStore = useSearchPageStore(
    {
      id: props.item.id,
    }
    // {
    //   debug: true,
    // }
  )
  const searchState = useHomeStateById<HomeStateItemSearch>(item.id)
  const { center, span } = searchState
  const { results, searchRegion, status } = searchPageStore
  const isLoading = status === 'loading'

  usePageLoadEffect(props, ({ item, isRefreshing }) => {
    if (isRefreshing && props.isActive) {
      homeStore.updateHomeState(`SearchPage.refresh`, {
        id: item.id,
        // set new position span before refreshing search
        center: appMapStore.nextPosition.center,
        span: appMapStore.nextPosition.span,
      })
      searchPageStore.refresh()
    }
  })

  useEffect(() => {
    if (!location.data) return
    // only on first time
    if (center) return
    // dont move it again quickly
    // this sort of logic could be put at the map level
    homeStore.updateHomeState(`search.location`, {
      id: item.id,
      center: location.data.center,
      span: location.data.span,
    })
  }, [center, JSON.stringify(location.data)])

  //
  // SEARCH
  //

  const searchKey = JSON.stringify([
    center,
    span,
    props.isActive,
    item.activeTags,
    item.searchQuery,
    item.id,
  ])

  const wasActive = useLastValue(props.isActive)

  useEffect(() => {
    if (!props.isActive) return
    // this should fix going back to search results triggering search
    if (!wasActive) return
    searchPageStore.runSearch({})
  }, [searchKey])

  useSetAppMap({
    isActive: props.isActive,
    results,
    showRank: true,
    zoomOnHover: true,
    hideRegions: !searchRegion,
    center,
    span,
    // TODO? once we have region toggle
    // region: location.data?.region?.name,
  })

  useEffect(() => {
    if (!tags.data) return
    if (!props.isActive) return
    addTagsToCache(tags.data)
  }, [props.isActive, tags.data])

  // sync mapStore.selected to activeIndex in results
  useEffect(() => {
    return reaction(
      appMapStore,
      (x) => x.selected,
      function mapSelectedToSearchPageSetIndex(selected) {
        if (!selected) return
        const restaurants = searchPageStore.results
        const index = restaurants.findIndex((x) => x.id === selected.id)
        if (index < 0) return
        return series([
          () => sleep(300),
          () => {
            searchPageStore.setIndex(index, appMapStore.hovered ? 'hover' : 'pin')
          },
        ])
      }
    )
  }, [])

  return (
    <Suspense fallback={<SearchLoading />}>
      <VStack
        flex={1}
        overflow="hidden"
        opacity={isLoading ? 0.75 : 1}
        width="100%"
        // in case something weird happens, prevents RecyclerListView from complaining
        minWidth={10}
      >
        <SearchPagePropsContext.Provider value={props}>
          {/* for web, disabled for now */}
          {/* <SearchResultsSimpleScroll key={`${isLoading}`} {...props} /> */}
          <SearchResultsInfiniteScroll {...props} />
        </SearchPagePropsContext.Provider>
      </VStack>
    </Suspense>
  )
})

const SearchNavBarContainer = memo(({ isActive }: { isActive: boolean }) => {
  const media = useMedia()
  let contents = isActive ? <SearchPageNavBar /> : null

  if (!media.sm) {
    return <HStack>{contents}</HStack>
  }

  if (!isWeb) {
    contents = (
      <AbsoluteVStack pointerEvents="none" bottom={0} height={150} width="100%">
        {contents}
      </AbsoluteVStack>
    )
  }

  return <RootPortalItem key={`${isActive}`}>{contents}</RootPortalItem>
})

// prevent warning
delete RecyclerListView.propTypes['externalScrollView']

const loadingResults: RestaurantSearchItem[] = [
  {
    isPlaceholder: true,
    meta: null as any,
    id: '',
    slug: '',
  },
]

const useActiveTagSlugs = (props: SearchProps) => {
  return useMemo(() => {
    return [
      ...slugify(props.item.searchQuery),
      ...Object.keys(props.item.activeTags || {}).filter((x) => {
        const isActive = props.item.activeTags[x]
        if (!isActive) {
          return false
        }
        const type = allTags[x]?.type ?? 'outlier'
        return type != 'filter' && type != 'outlier'
      }),
    ]
  }, [props.item.activeTags])
}

const SearchResultsInfiniteScroll = memo((props: SearchProps) => {
  const drawerWidth = useAppDrawerWidth()
  const searchPageStore = useSearchPageStore({
    id: props.item.id,
  })
  const activeTagSlugs = useActiveTagSlugs(props)
  const { status } = searchPageStore

  let results = searchPageStore.results

  if (searchPageStore.status === 'loading') {
    results = loadingResults
  }

  const dataProvider = useMemo(() => {
    return new DataProvider((r1, r2) => {
      return r1.id !== r2.id
    }).cloneWithRows(results)
  }, [results])

  const layoutProvider = useMemo(() => {
    return new LayoutProvider(
      (index) => {
        return 'listitem'
      },
      (type, dim) => {
        dim.width = drawerWidth
        dim.height = ITEM_HEIGHT
      }
    )
  }, [drawerWidth])

  const rowRenderer = useCallback(
    (
      type: string | number,
      data: RestaurantSearchItem,
      index: number
      // extendedState?: object
    ) => {
      if (data.isPlaceholder) {
        return <LoadingItem size="lg" />
      }
      return (
        <RestaurantListItem
          curLocInfo={props.item.curLocInfo ?? null}
          restaurantId={data.id}
          restaurantSlug={data.slug}
          rank={index + 1}
          activeTagSlugs={activeTagSlugs}
          meta={data.meta}
        />
      )
    },
    [activeTagSlugs]
  )

  if (status !== 'loading' && results.length === 0) {
    return <SearchEmptyResults />
  }

  return (
    <>
      <RecyclerListView
        style={listStyle}
        canChangeSize
        externalScrollView={SearchPageScrollView as any}
        scrollViewProps={{
          id: props.item.id,
        }}
        renderAheadOffset={ITEM_HEIGHT * (isWeb ? 8 : 12)}
        rowRenderer={rowRenderer}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        deterministic
      />
    </>
  )
})

const SearchEmptyResults = () => {
  return (
    <>
      <SearchHeader />
      <VStack paddingVertical={100} alignItems="center" spacing>
        <Paragraph fontSize={22}>No results</Paragraph>
        <Text fontSize={32}>😞</Text>
      </VStack>
    </>
  )
}

const listStyle = {
  flex: 1,
  width: '100%',
  minWidth: 300,
  minHeight: 1,
  height: '100%',
}

type SearchPageScrollViewProps = ScrollViewProps & {
  onSizeChanged: (props?: LayoutRectangle) => void
  id: string
}

const SearchPageScrollView = forwardRef<ScrollView, SearchPageScrollViewProps>(
  ({ children, onSizeChanged, id, ...props }, ref) => {
    const scrollRef = useRef<ScrollView>()
    const searchPageStore = getSearchPageStore()

    useEffect(() => {
      return reaction(
        searchPageStore,
        (x) => [x.index, x.event] as const,
        function searchPageIndexToSCroll([index, event]) {
          if (event === 'pin' || event === 'key') {
            scrollRef.current?.scrollTo({
              x: 0,
              y: ITEM_HEIGHT * index,
              animated: true,
            })
          }
        }
      )
    }, [])

    const scrollToTopHandler = useCallback(() => {
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
    }, [])

    const layoutProps = useLayout({
      stateless: true,
      onLayout: (x) => {
        onSizeChanged?.(x.nativeEvent.layout)
      },
    })

    useEffect(() => {
      searchPageStore.setChildren(children)
    }, [searchPageStore.results])

    // memo is important here, keeps scroll from stopping on ios safari
    return useMemo(() => {
      return (
        <View style={{ flexGrow: 1 }} {...layoutProps}>
          <ContentScrollView id="search" ref={combineRefs(ref, scrollRef) as any} {...props}>
            <PageContentWithFooter>
              <SearchHeader />
              <SearchContent id={id} />
              <SearchFooter scrollToTop={scrollToTopHandler} id={id} />
            </PageContentWithFooter>
          </ContentScrollView>
        </View>
      )
    }, [])
  }
)

const SearchContent = memo(({ id }: { id: string }) => {
  const { children } = useSearchPageStore({
    id,
  })
  return (
    <VStack position="relative">
      <Suspense fallback={null}>{children}</Suspense>
    </VStack>
  )
})

const SearchFooter = memo(({ scrollToTop, id }: { scrollToTop: Function; id: string }) => {
  const { results } = useSearchPageStore({
    id,
  })
  return (
    <VStack alignItems="center" justifyContent="center" minHeight={300} width="100%">
      <Button
        alignSelf="center"
        borderRadius={1000}
        onPress={() => {
          scrollToTop()
        }}
      >
        <ArrowUp />
      </Button>
      <Spacer size={40} />
      <Paragraph opacity={0.5}>Showing {results.length} results</Paragraph>
    </VStack>
  )
})

const SearchLoading = (props: StackProps) => {
  return (
    <VStack flex={1} width="100%" minHeight={300} {...props}>
      <LoadingItem />
    </VStack>
  )
}

function useTagsFromRoute(route: HistoryItem<'search'>) {
  const key = `tags-${Object.entries(route)
    .map((x) => x.join(','))
    .join(',')}`
  return useQueryLoud(key, () => getFullTagsFromRoute(route), {
    suspense: false,
  })
}

// ... in Map.tsx the fitBounds that runs
// in some cases comes from `center/span` above which are
// estimates of the final bounds basically, we can't get that
// from mapbox (no `map.getFinalBoundsFor(bounds)`)
// instead of doing complicated things in Map, once center changes,
// the *next* movement
// from map we can safely ignore! because it will almost always change
// worst case is not bad: we miss a movement, but they can just touch
// map again and it will show "re-search in area button"
// useEffect(() => {
//   let runs = 0
//   const dispose = reaction(
//     appMapStore,
//     (x) => x.nextPosition,
//     function setSearchPosition(x) {
//       searchPageStore.setSearchPosition(x)
//       runs++
//       if (runs > 1) {
//         dispose()
//       }
//     }
//   )
//   return dispose
// }, [props.item.id, center])

// disabled for now, too easy to regress
// // sync mapStore.selected to activeIndex in results
// if (isWeb) {
//   useEffect(() => {
// should i try without reaction2? that couldve been causing weridness?
//     return reaction2(() => {
//       const { searchPosition, status } = searchPageStore
//       const { nextPosition, isOnRegion } = appMapStore
//       if (status === 'loading') return
//       if (isOnRegion) {
//         return
//       }
//       return series([
//         () => sleep(600),
//         () => {
//           const props = getProps()
//           if (!props.isActive) return
//           // not on region, set to coordinates
//           const { center, span } = searchPosition
//           const pos = [center.lat, center.lng, span.lat, span.lng].map(
//             (x) => Math.round(x * 1000) / 1000
//           )
//           console.warn('should set', pos.join('_'))
//           // router.setParams({
//           //   region: pos.join('_'),
//           // })
//         },
//       ])
//     })
//   }, [])
// }

// import is broken maybe i have too recent react-native version?
// i think the proxies break it, Element type invalid expected
// return (
//   <FlatList
//     ListHeaderComponent={SearchHeader}
//     ListFooterComponent={SearchFooter}
//     removeClippedSubviews
//     initialNumToRender={Math.ceil(getWindowHeight() / ITEM_HEIGHT)}
//     data={results}
//     renderItem={({ item, index }) => (
//       <RestaurantListItem
//         curLocInfo={props.item.curLocInfo ?? null}
//         restaurantId={item.id}
//         restaurantSlug={item.slug}
//         rank={index + 1}
//         activeTagSlugs={activeTagSlugs}
//         meta={item.meta}
//       />
//     )}
//     keyExtractor={(item) => item.id}
//   />
// )

// // web was feeling slow with recyclerlistview:
// // https://github.com/Flipkart/recyclerlistview/issues/601
// const SearchResultsSimpleScroll = memo((props: Props) => {
//   const { results, status } = useSearchPageStore()
//   const activeTagSlugs = useActiveTagSlugs(props)
//   const scrollRef = useRef<ScrollView>(null)
//   const scrollToTopHandler = useCallback(() => {
//     scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true })
//   }, [])

//   if (status === 'loading') {
//     return <LoadingItems />
//   }

//   if (!results.length) {
//     return <SearchEmptyResults />
//   }

//   return (
//     <ScrollView ref={scrollRef}>
//       <PageContentWithFooter>
//         <SearchHeader />
//         <VStack position="relative" flex={10} minHeight={600}>
//           <SuspenseList revealOrder="forwards">
//             {results.map((data, index) => {
//               return (
//                 <VStack key={index} height={ITEM_HEIGHT}>
//                   <RestaurantListItem
//                     curLocInfo={props.item.curLocInfo ?? null}
//                     restaurantId={data.id}
//                     restaurantSlug={data.slug}
//                     rank={index + 1}
//                     activeTagSlugs={activeTagSlugs}
//                     meta={data.meta}
//                   />
//                 </VStack>
//               )
//             })}
//           </SuspenseList>
//         </VStack>
//         <Suspense fallback={null}>
//           <SearchFooter
//             numResults={searchPageStore.results.length}
//             scrollToTop={scrollToTopHandler}
//           />
//         </Suspense>
//       </PageContentWithFooter>
//     </ScrollView>
//   )
// })
