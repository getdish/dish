import { isWeb } from '../../../constants/constants'
import { tagLenses } from '../../../constants/localTags'
import { addTagsToCache, allTags } from '../../../helpers/allTags'
import { getActiveTagSlugs } from '../../../helpers/getActiveTagSlugs'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { getWindow } from '../../../helpers/getWindow'
import { getFullTagsFromRoute } from '../../../helpers/syncStateFromRoute'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { weakKey } from '../../../helpers/weakKey'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { RootPortalItem } from '../../Portal'
import { appMapStore, useSetAppMap } from '../../appMapStore'
import { drawerStore } from '../../drawerStore'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useLastValue } from '../../hooks/useLastValue'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useIsMobileDevice } from '../../useIsMobileDevice'
import { ContentScrollView } from '../../views/ContentScrollView'
import { LenseButtonBar } from '../../views/LenseButtonBar'
import { PageHead } from '../../views/PageHead'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeSuspense } from '../HomeSuspense'
import { PageContent } from '../PageContent'
import { ITEM_HEIGHT, RestaurantListItem } from '../restaurant/RestaurantListItem'
import { SearchHeader } from './SearchHeader'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPagePropsContext } from './SearchPagePropsContext'
import { getSearchPageStore, setStore, useSearchPageStore } from './SearchPageStore'
import { SearchProps } from './SearchProps'
import { useLocationFromRoute } from './useLocationFromRoute'
import { series, sleep } from '@dish/async'
import { RestaurantSearchItem, slugify } from '@dish/graph'
import { HistoryItem } from '@dish/router'
import {
  AbsoluteYStack,
  Button,
  LoadingItem,
  Paragraph,
  Spacer,
  Text,
  Theme,
  XStack,
  YStack,
  YStackProps,
  combineRefs,
  useDebounceEffect,
  useMedia,
} from '@dish/ui'
import {
  Store,
  compareStrict,
  reaction,
  useStore,
  useStoreInstanceSelector,
} from '@dish/use-store'
import { ArrowUp } from '@tamagui/feather-icons'
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
import { LayoutRectangle, ScrollView, ScrollViewProps, StyleSheet, View } from 'react-native'
import { DataProvider, LayoutProvider, RecyclerListView } from 'recyclerlistview'

export default memo(function SearchPage(props: SearchProps) {
  const state = useHomeStateById<HomeStateItemSearch>(props.item.id)
  const searchPageStore = useSearchPageStore({
    id: props.item.id,
  })
  const { title } = getTitleForState(state, {
    lowerCase: true,
  })
  const route = useLastValueWhen(
    () => router.curPage as HistoryItem<'search'>,
    router.curPage.name !== 'search'
  )

  const activeSlugs = getActiveTagSlugs(state.activeTags)
  const lenseSlug = activeSlugs.filter((slug) => tagLenses.find((l) => l.slug === slug))[0]
  const lenseTag = lenseSlug ? tagLenses.find((x) => x.slug === lenseSlug)! : tagLenses[0]

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
        if (homeStore.currentState.curLocName) {
          console.warn('no need for info rn we have a region')
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
      <Theme name={lenseTag['color']}>
        <StackDrawer closable>
          <HomeSuspense fallback={<SearchLoading />}>
            <SearchPageContent
              key={
                state.id + JSON.stringify([state.activeTags, state.searchQuery, state.region])
              }
              {...props}
              route={route}
              item={state}
            />
          </HomeSuspense>
        </StackDrawer>
      </Theme>
    </>
  )
})

const SearchPageContent = memo(function SearchPageContent(
  props: SearchProps & { route: HistoryItem<'search'> }
) {
  const { item } = props
  const location = useLocationFromRoute(props.route)
  const tags = useTagsFromRoute(props.route)
  const searchPageStore = useSearchPageStore({
    id: props.item.id,
  })
  const searchState = useHomeStateById<HomeStateItemSearch>(item.id)
  const { center, span } = searchState
  const { results, searchRegion, status } = searchPageStore
  const isLoading = status === 'loading'

  usePageLoadEffect(props, ({ isRefreshing }) => {
    if (isRefreshing && props.isActive) {
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

  useDebounceEffect(
    () => {
      if (!props.isActive) return
      // this should fix going back to search results triggering search
      if (!wasActive) return
      console.log('searchpage run search', props.isActive, wasActive, props)
      searchPageStore.runSearch({})
    },
    100,
    [searchKey]
  )

  useSetAppMap({
    id: props.item.id,
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
      <YStack
        flex={1}
        overflow="hidden"
        opacity={isLoading ? 0.5 : 1}
        width="100%"
        // in case something weird happens, prevents RecyclerListView from complaining
        minWidth={10}
      >
        <SearchPagePropsContext.Provider value={props}>
          {/* for web, disabled for now */}
          {/* <SearchResultsSimpleScroll key={`${isLoading}`} {...props} /> */}
          <SearchResultsInfiniteScroll {...props} />
        </SearchPagePropsContext.Provider>
      </YStack>
    </Suspense>
  )
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
          restaurantSlug={data.slug}
          rank={index + 1}
          activeTagSlugs={activeTagSlugs}
          meta={data.meta}
        />
      )
    },
    [activeTagSlugs]
  )

  const isMobilePhone = useIsMobileDevice()

  if (status !== 'loading' && results.length === 0) {
    return <SearchEmptyResults />
  }

  return (
    <RecyclerListView
      // style={sheet.listStyle}
      key={weakKey(results)}
      // canChangeSize
      externalScrollView={SearchPageScrollView as any}
      scrollViewProps={{
        id: props.item.id,
      }}
      renderAheadOffset={ITEM_HEIGHT * (isWeb ? 5 : 8)}
      rowRenderer={rowRenderer}
      dataProvider={dataProvider}
      layoutProvider={layoutProvider}
      useWindowScroll
    />
  )
})

const SearchEmptyResults = () => {
  return (
    <>
      <SearchHeader />
      <YStack paddingVertical={100} alignItems="center" space>
        <Paragraph fontSize={22}>No results</Paragraph>
        <Text fontSize={32}>😞</Text>
      </YStack>
    </>
  )
}

type SearchPageScrollViewProps = ScrollViewProps & {
  onSizeChanged: (props?: LayoutRectangle) => void
  id: string
}

const SearchPageScrollView = forwardRef<ScrollView, SearchPageScrollViewProps>(
  ({ children, onSizeChanged, id, ...props }, ref) => {
    const scrollRef = useRef<ScrollView>()
    const searchPageStore = getSearchPageStore()
    const isMobilePhone = useIsMobileDevice()

    // for now, scrollRef doesnt have scrollTo?
    useEffect(() => {
      return reaction(
        searchPageStore,
        (x) => [x.index, x.event] as const,
        function searchPageIndexToScroll([index, event]) {
          if (event === 'pin' || event === 'key') {
            scrollRef.current?.scrollTo?.({
              x: 0,
              y: ITEM_HEIGHT * index,
              animated: true,
            })
          }
        }
      )
    }, [])

    // replicating RecyclerListView useWindow support
    const layoutRef = useRef<any>(null)
    if (isMobilePhone) {
      useEffect(() => {
        const target = layoutRef!.current! as any
        if (!target) return
        const onScroll = () => {
          if (!props.onScroll) return
          props.onScroll({
            // @ts-ignore
            nativeEvent: {
              contentOffset: {
                get x(): number {
                  return window.scrollX === undefined ? window.pageXOffset : window.scrollX
                },
                get y(): number {
                  return window.scrollY === undefined ? window.pageYOffset : window.scrollY
                },
              },
              contentSize: {
                get height(): number {
                  return target.offsetHeight
                },
                get width(): number {
                  return target.offsetWidth
                },
              },
              layoutMeasurement: {
                get height(): number {
                  return window.innerHeight
                },
                get width(): number {
                  return window.innerWidth
                },
              },
            },
          })
        }
        window.addEventListener('scroll', onScroll)
        return () => {
          window.removeEventListener('scroll', onScroll)
        }
      }, [])
    }

    const scrollToTopHandler = useCallback(() => {
      scrollRef.current?.scrollTo?.({ x: 0, y: 0, animated: true })
    }, [])

    return (
      <View
        ref={layoutRef}
        style={{ height: '100%', width: '100%', overflow: 'hidden' }}
        onLayout={(x) => {
          if (isMobilePhone) {
            // @ts-ignore
            return onSizeChanged(getWindow())
          }
          console.log('x.nativeEvent.layout', x.nativeEvent.layout)
          onSizeChanged?.(x.nativeEvent.layout)
        }}
      >
        {/* <ContentScrollView id="search" ref={combineRefs(ref, scrollRef) as any} {...props}> */}
        <PageContent>
          <SearchHeader />
          <SearchPageNavBar />
          <Spacer size="$7" />
          <SearchContent>{children}</SearchContent>
          <Suspense fallback={null}>
            <SearchFooter id={id} scrollToTop={scrollToTopHandler} />
          </Suspense>
        </PageContent>
        {/* </ContentScrollView> */}
      </View>
    )
  }
)

const SearchContent = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <YStack position="relative">
      <Suspense fallback={null}>{children}</Suspense>
    </YStack>
  )
})

const SearchFooter = memo(({ scrollToTop, id }: { scrollToTop: Function; id: string }) => {
  const state = useHomeStateById<HomeStateItemSearch>(id)
  const { results } = useSearchPageStore({
    id,
  })
  return (
    <YStack alignItems="center" justifyContent="center" minHeight={300} width="100%">
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
      <Spacer size={40} />
      <XStack>
        <LenseButtonBar activeTags={state.activeTags} />
      </XStack>
    </YStack>
  )
})

const SearchLoading = (props: YStackProps) => {
  return (
    <YStack flex={1} width="100%" minHeight={300} {...props}>
      <LoadingItem />
    </YStack>
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
