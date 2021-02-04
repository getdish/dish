import { series, sleep } from '@dish/async'
import {
  RestaurantSearchItem,
  graphql,
  listFindOne,
  listInsert,
  mutate,
  slugify,
} from '@dish/graph'
import { query } from '@dish/graph/src'
import { assertPresent, isPresent } from '@dish/helpers/src'
import { ArrowUp, Edit2 } from '@dish/react-feather'
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
import { Arrow } from 'react-laag'
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
  Toast,
  Tooltip,
  VStack,
  combineRefs,
  useGet,
  useMedia,
} from 'snackui'

import { isWeb } from '../../../constants/constants'
import { addTagsToCache, allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getFullTags } from '../../../helpers/getFullTags'
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
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import { ContentScrollView } from '../../views/ContentScrollView'
import {
  ContentScrollViewHorizontalFitted,
  useContentScrollHorizontalFitter,
} from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { ListCardHorizontal } from '../../views/list/ListCard'
import { PageTitleTag } from '../../views/PageTitleTag'
import { SlantedTitle } from '../../views/SlantedTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { HomeSuspense } from '../HomeSuspense'
import { randomListColor } from '../list/listColors'
import {
  ITEM_HEIGHT,
  RestaurantListItem,
} from '../restaurant/RestaurantListItem'
import { PageTitle } from './PageTitle'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { SearchPageScoring } from './SearchPageScoring'
import { searchPageStore, useSearchPageStore } from './SearchPageStore'
import { searchResultsStore } from './searchResultsStore'
import {
  getLocationFromRoute,
  useLocationFromRoute,
} from './useLocationFromRoute'

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
      <StackDrawer
        closable
        topLeftControls={
          <SearchForkListButton {...{ title, subTitle, state, route }} />
        }
      >
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

const SearchForkListButton = memo(
  ({
    title,
    subTitle,
    state,
    route,
  }: {
    title: string
    subTitle: string
    state: HomeStateItemSearch
    route: HistoryItem<'search'>
  }) => {
    const location = useLocationFromRoute(route)
    const regionName = location.data?.region?.name
    const tooltip = `Make your "${title.replace('the ', '')}${
      regionName ? ` in ${regionName}` : ''
    }" list`
    return (
      <Tooltip contents={tooltip}>
        <Link
          promptLogin
          onPress={async () => {
            try {
              const { id, username } = userStore.user ?? {}
              assertPresent(id, 'no user id')
              assertPresent(username, 'no username')
              const name = `The best ${title}`
              const slug = slugify(name)
              const location = await getLocationFromRoute(router.curPage as any)
              if (!location?.region) {
                console.warn('no region??????')
                return
              }
              const region = location.region.slug
              assertPresent(region, 'no region')
              const existing = await listFindOne(
                {
                  slug,
                  user_id: id,
                  region,
                },
                {
                  depth: 1,
                }
              )
              if (existing) {
                console.warn('go to existing')
                router.navigate({
                  name: 'list',
                  params: {
                    slug,
                    region,
                    userSlug: username,
                  },
                })
                return
              }
              const [list] = await listInsert([
                {
                  name,
                  slug,
                  region,
                  description: subTitle,
                  color: randomListColor(),
                  user_id: id,
                  location: null,
                },
              ])
              // now add tags to it
              const tags = await getFullTags(getActiveTags(state))
              if (tags.some((tag) => !tag.id)) {
                console.error(`no tag id??`, tags)
                debugger
                return
              }
              await mutate((mutation) => {
                return mutation.insert_list_tag({
                  objects: tags.map((tag) => {
                    return {
                      list_id: list.id,
                      tag_id: tag.id,
                    }
                  }),
                })?.__typename
              })
              router.navigate({
                name: 'list',
                params: {
                  slug,
                  region,
                  userSlug: username,
                },
              })
            } catch (err) {
              // if this list already exists, we can just take them to it
              Toast.error(err.message)
              console.error(err)
            }
          }}
        >
          <SmallCircleButton shadowed>
            <Edit2 color="#fff" size={14} />
          </SmallCircleButton>
        </Link>
      </Tooltip>
    )
  }
)

const SearchHeader = () => {
  const { width, setWidthDebounce } = useContentScrollHorizontalFitter()
  const media = useMedia()
  return (
    <ContentScrollViewHorizontalFitted
      width={width}
      setWidth={setWidthDebounce}
    >
      <VStack>
        <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
        <HStack>
          <VStack width={width}>
            <SearchPageTitle />
            <SearchPageScoring />
          </VStack>
          <VStack marginBottom={8} position="relative">
            <AbsoluteVStack
              top={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              left={-55}
            >
              <SlantedTitle size="xs">Lists</SlantedTitle>
              <AbsoluteVStack right={-12} transform={[{ rotate: '180deg' }]}>
                <Arrow />
              </AbsoluteVStack>
            </AbsoluteVStack>
            <SearchPageListsRow />
          </VStack>
        </HStack>
      </VStack>
    </ContentScrollViewHorizontalFitted>
  )
}

const SearchPageListsRow = memo(
  graphql((props: any) => {
    const curProps = useContext(SearchPagePropsContext)!
    const region = curProps.item.region

    if (!region) {
      return null
    }

    const tags = getActiveTags(curProps.item)
    const lists = query.list_populated({
      args: {
        min_items: 2,
      },
      where: {
        region: {
          _eq: region,
        },
        tags: {
          tag: {
            slug: {
              _in: tags.map((x) => x.slug).filter(isPresent),
            },
          },
        },
      },
    })

    return (
      <>
        {lists.map((list, i) => {
          return (
            <ListCardHorizontal
              key={i}
              slug={list.slug}
              userSlug={list.user?.username ?? ''}
              region={list.region ?? ''}
            />
          )
        })}
      </>
    )
  })
)

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
  const sk = JSON.stringify([item.activeTags, item.searchQuery, center])
  useEffect(() => {
    if (!props.isActive) return
    // searchStore.resetResults()
    // reset on all page loads
    console.warn('got>>', props.item, center)
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
      (x) => {
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
      (selected) => {
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

const SearchPageTitle = memo(() => {
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
        ([index, event]) => {
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
