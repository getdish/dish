import { series, sleep } from '@dish/async'
import { RestaurantSearchItem, slugify } from '@dish/graph'
import { ArrowUp } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import { reaction, reaction2 } from '@dish/use-store'
import React, {
  Suspense,
  createContext,
  forwardRef,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { ScrollView, ScrollViewProps } from 'react-native'
import {
  DataProvider,
  LayoutProvider,
  RecyclerListView,
} from 'recyclerlistview'
import {
  AbsoluteVStack,
  Button,
  HStack,
  LoadingItem,
  Spacer,
  StackProps,
  Text,
  VStack,
  combineRefs,
  useGet,
  useMedia,
} from 'snackui'

import { isWeb } from '../../../constants/constants'
import { addTagsToCache, allTags } from '../../../helpers/allTags'
import { getFullTagsFromRoute } from '../../../helpers/getTagsFromRoute'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgbString'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { appMapStore, useSetAppMap } from '../../AppMapStore'
import { useHomeStateById } from '../../homeStore'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { RootPortalItem } from '../../Portal'
import { ContentScrollView } from '../../views/ContentScrollView'
import { PageTitleTag } from '../../views/PageTitleTag'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { HomeSuspense } from '../HomeSuspense'
import {
  ITEM_HEIGHT,
  RestaurantListItem,
} from '../restaurant/RestaurantListItem'
import { PageTitle } from './PageTitle'
import { SearchHeader } from './SearchHeader'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { SearchPageScoring } from './SearchPageScoring'
import { searchPageStore, useSearchPageStore } from './SearchPageStore'
import { searchResultsStore } from './searchResultsStore'
import { useLocationFromRoute } from './useLocationFromRoute'

type Props = HomeStackViewProps<HomeStateItemSearch>
export const SearchPagePropsContext = createContext<Props | null>(null)

export default memo(function SearchPage(props: Props) {
  const state = useHomeStateById<HomeStateItemSearch>(props.item.id)
  const { title, subTitle } = getTitleForState(state, {
    lowerCase: true,
  })
  const route = useLastValueWhen(
    () => router.curPage,
    router.curPage.name !== 'search'
  ) as HistoryItem<'search'>

  console.log('👀 SearchPage', state.activeTags, title)

  return (
    <>
      <PageTitleTag>{title}</PageTitleTag>
      <StackDrawer closable>
        <HomeSuspense>
          <SearchNavBarContainer isActive={props.isActive} />
        </HomeSuspense>
        <HomeSuspense fallback={<SearchLoading />}>
          <SearchPageContent
            key={state.id + JSON.stringify(state.activeTags)}
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
  props: Props & { route: HistoryItem<'search'> }
) {
  const location = useLocationFromRoute(props.route)
  const tags = useTagsFromRoute(props.route)
  const searchStore = useSearchPageStore()
  const getProps = useGet(props)
  const center = location.data?.center

  usePageLoadEffect(props, ({ isRefreshing }) => {
    if (isRefreshing && props.isActive) {
      searchPageStore.refresh()
    }
  })

  useSetAppMap({
    isActive: props.isActive,
    results: searchStore.results,
    showRank: true,
    center,
    span: location.data?.span,
    ...(location.data?.region && {
      region: {
        name: location.data.region.name,
        slug: location.data.region.name,
        geometry: {} as any,
        via: 'url',
      },
    }),
  })

  const { item } = props

  //
  // SEARCH
  //
  const sk = JSON.stringify([item.activeTags, item.searchQuery])
  useEffect(() => {
    if (!props.isActive) return
    searchPageStore.runSearch({})
  }, [sk])

  // ... in Map.tsx the fitBounds that runs
  // in some cases comes from `center/span` above which are
  // estimates of the final bounds basically, we can't get that
  // from mapbox (no `map.getFinalBoundsFor(bounds)`)
  // instead of doing complicated things in Map, once center changes,
  // the *next* movement
  // from map we can safely ignore! because it will almost always change
  // worst case is not bad: we miss a movement, but they can just touch
  // map again and it will show "re-search in area button"
  useEffect(() => {
    let runs = 0
    const dispose = reaction(
      appMapStore,
      (x) => x.nextPosition,
      function setSearchPosition(x) {
        searchPageStore.setSearchPosition(x)
        runs++
        if (runs > 1) {
          dispose()
        }
      }
    )
    return dispose
  }, [props.item.id, center])

  // sync mapStore.selected to activeIndex in results
  if (isWeb) {
    useEffect(() => {
      return reaction2(() => {
        const { searchPosition, status } = searchPageStore
        const { nextPosition, isOnRegion } = appMapStore
        if (status === 'loading') return
        if (isOnRegion) {
          return
        }
        return series([
          () => sleep(600),
          () => {
            const props = getProps()
            if (!props.isActive) return
            // not on region, set to coordinates
            const { center, span } = searchPosition
            const pos = [center.lat, center.lng, span.lat, span.lng].map(
              (x) => Math.round(x * 1000) / 1000
            )
            console.warn('should set', pos.join('_'))
            // router.setParams({
            //   region: pos.join('_'),
            // })
          },
        ])
      })
    }, [])
  }

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
        const restaurants = searchStore.results
        const index = restaurants.findIndex((x) => x.id === selected.id)
        if (index < 0) return
        return series([
          () => sleep(300),
          () => {
            searchPageStore.setIndex(
              index,
              appMapStore.hovered ? 'hover' : 'pin'
            )
          },
        ])
      }
    )
  }, [])

  const isLoading = searchStore.status === 'loading'

  return (
    <Suspense fallback={<SearchLoading />}>
      <VStack
        flex={1}
        overflow="hidden"
        // opacity={isLoading ? 0.5 : 1}
        width="100%"
        // in case something weird happens, prevents RecyclerListView from complaining
        minWidth={10}
      >
        <SearchPagePropsContext.Provider value={props}>
          <SearchResultsContent key={`${isLoading}`} {...props} />
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

const SearchResultsContent = (props: Props) => {
  const drawerWidth = useAppDrawerWidth()
  const searchStore = useSearchPageStore()
  const { status } = searchStore

  let results = searchStore.results

  if (searchStore.status === 'loading') {
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

  const activeTagSlugs = useMemo(() => {
    return [
      ...slugify(props.item.searchQuery),
      ...Object.keys(props.item.activeTags || {}).filter((x) => {
        const isActive = props.item.activeTags[x]
        if (!isActive) {
          return false
        }
        const type = allTags[x]?.type ?? 'outlier'
        return type != 'lense' && type != 'filter' && type != 'outlier'
      }),
    ]
  }, [props.item.activeTags])

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
    [results]
  )

  useEffect(() => {
    const searchResultsPositions: Record<string, number> = {}
    results.forEach((v, index) => {
      searchResultsPositions[v.id] = index + 1
    })
    console.warn('results changed', results)
    searchResultsStore.setRestaurantPositions(searchResultsPositions)
  }, [results])

  if (status !== 'loading' && results.length === 0) {
    return (
      <>
        <SearchPageTitle />
        <SearchPageScoring />
        <VStack paddingVertical={100} alignItems="center" spacing>
          <Text fontSize={22}>Nothing found</Text>
          <Text fontSize={32}>😞</Text>
        </VStack>
      </>
    )
  }

  return (
    <>
      <RecyclerListView
        style={{
          flex: 1,
          width: '100%',
          minWidth: 300,
          height: '100%',
        }}
        canChangeSize
        externalScrollView={SearchPageScrollView as any}
        renderAheadOffset={1000}
        rowRenderer={rowRenderer}
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        deterministic
      />
    </>
  )
}

type SearchPageScrollViewProps = ScrollViewProps & {
  onSizeChanged: (props: { width: number; height: number }) => any
}

export const SearchPageTitle = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: true,
  })
  const lenseColor = useCurrentLenseColor()
  return (
    <>
      <PageTitle
        title={title}
        subTitle={subTitle}
        color={rgbString(lenseColor.map((x) => x * 0.92))}
      />
      <Suspense fallback={null}>
        <SearchPageResultsInfoBox state={curProps.item} />
      </Suspense>
    </>
  )
})

const SearchPageScrollView = forwardRef<ScrollView, SearchPageScrollViewProps>(
  ({ children, onSizeChanged, ...props }, ref) => {
    const scrollRef = useRef<ScrollView>()

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

    const handleLayout = useCallback((e) => {
      const { width, height } = e.nativeEvent.layout
      onSizeChanged({ width, height })
    }, [])

    return (
      <VStack onLayout={handleLayout} flex={1}>
        <ContentScrollView
          id="search"
          ref={combineRefs(ref, scrollRef) as any}
          {...props}
        >
          <SearchHeader />
          <Spacer />
          <VStack position="relative" flex={10} minHeight={600}>
            {children}
          </VStack>
          <Suspense fallback={null}>
            <SearchFooter
              numResults={searchPageStore.results.length}
              scrollToTop={scrollToTopHandler}
            />
            <VStack height={400} />
          </Suspense>
        </ContentScrollView>
      </VStack>
    )
  }
)

const SearchFooter = ({
  numResults,
  scrollToTop,
}: {
  numResults: number
  scrollToTop: Function
}) => {
  return (
    <VStack
      alignItems="center"
      justifyContent="center"
      minHeight={300}
      width="100%"
    >
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
      <Text opacity={0.5} fontSize={12}>
        Showing {numResults} results
      </Text>
    </VStack>
  )
}

const SearchLoading = (props: StackProps) => {
  return (
    <VStack flex={1} width="100%" minHeight={300} {...props}>
      <LoadingItem />
    </VStack>
  )
}

function useTagsFromRoute(route: HistoryItem<'search'>) {
  const key = `tags-${Object.values(route).join(',')}`
  return useQueryLoud(key, () => getFullTagsFromRoute(route), {
    suspense: false,
  })
}
