import { series, sleep } from '@dish/async'
import { RestaurantSearchItem, slugify } from '@dish/graph'
import { ArrowUp, Edit2 } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import { reaction } from '@dish/use-store'
import { sortBy } from 'lodash'
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
import Svg, { Polygon } from 'react-native-svg'
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
  Tooltip,
  VStack,
  combineRefs,
  useMedia,
  useTheme,
} from 'snackui'

import { isWeb } from '../../../constants/constants'
import { addTagsToCache, allTags } from '../../../helpers/allTags'
import { getActiveTags } from '../../../helpers/getActiveTags'
import { getTagsFromRoute } from '../../../helpers/getTagsFromRoute'
import { getTitleForState } from '../../../helpers/getTitleForState'
import { rgbString } from '../../../helpers/rgbString'
import { useQueryLoud } from '../../../helpers/useQueryLoud'
import { router } from '../../../router'
import { HomeStateItemSearch } from '../../../types/homeTypes'
import { appMapStore, useSetAppMapResults } from '../../AppMapStore'
import { AppPortalItem } from '../../AppPortal'
import { useHomeStateById, useHomeStore } from '../../homeStore'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { userStore } from '../../userStore'
import { SmallCircleButton } from '../../views/CloseButton'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { PageTitleTag } from '../../views/PageTitleTag'
import { SlantedTitle } from '../../views/SlantedTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { HomeSuspense } from '../HomeSuspense'
import {
  ITEM_HEIGHT,
  RestaurantListItem,
} from '../restaurant/RestaurantListItem'
import { PageTitle } from './PageTitle'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { searchPageStore, useSearchPageStore } from './SearchPageStore'
import { searchResultsStore } from './searchResultsStore'
import { useLocationFromRoute } from './useLocationFromRoute'

type Props = HomeStackViewProps<HomeStateItemSearch>
const SearchPagePropsContext = createContext<Props | null>(null)

export default memo(function SearchPage(props: Props) {
  const state = useHomeStateById<HomeStateItemSearch>(props.item.id)
  const { title } = getTitleForState(state, {
    lowerCase: false,
  })

  return (
    <>
      <PageTitleTag>{title}</PageTitleTag>
      <StackDrawer
        closable
        topLeftControls={
          <Tooltip contents={`Make your "${title.replace('the ', '')}" list`}>
            <Link
              name="list"
              promptLogin
              params={{
                userSlug: userStore.user?.username ?? '',
                slug: 'create',
                state: getActiveTags(state.activeTags)
                  .map((x) => x.slug)
                  .join(','),
              }}
            >
              <SmallCircleButton shadowed>
                <Edit2 color="#fff" size={14} />
              </SmallCircleButton>
            </Link>
          </Tooltip>
        }
      >
        <HomeSuspense>
          <SearchNavBarContainer isActive={props.isActive} />
        </HomeSuspense>
        <HomeSuspense fallback={<SearchLoading />}>
          <SearchPageContent
            key={state.id + JSON.stringify(state.activeTags)}
            {...props}
            item={state}
          />
        </HomeSuspense>
      </StackDrawer>
    </>
  )
})

const SearchPageContent = memo(function SearchPageContent(props: Props) {
  const home = useHomeStore()
  const route = useLastValueWhen(
    () => router.curPage,
    router.curPage.name !== 'search'
  ) as HistoryItem<'search'>
  const location = useLocationFromRoute(route)
  const tags = useTagsFromRoute(route)
  const searchStore = useSearchPageStore()

  usePageLoadEffect(props, ({ isRefreshing }) => {
    if (isRefreshing && props.isActive) {
      searchPageStore.refresh()
    }
  })

  useSetAppMapResults({
    isActive: props.isActive,
    results: searchStore.results,
    showRank: true,
  })

  useEffect(() => {
    if (!location.data) return
    if (!props.isActive) return
    const searchItem: HomeStateItemSearch = {
      ...props.item,
      center: location.data.center,
      span: location.data.span,
    }
    home.updateCurrentState('SearchPage.locationFromRoute', searchItem)
  }, [props.isActive, location.data])

  useEffect(() => {
    if (!props.isActive) return
    searchPageStore.runSearch({})
  }, [props.item])

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

  return <AppPortalItem key={`${isActive}`}>{contents}</AppPortalItem>
})

// prevent warning
delete RecyclerListView.propTypes['externalScrollView']

const SearchResultsContent = (props: Props) => {
  const drawerWidth = useAppDrawerWidth()
  const searchStore = useSearchPageStore()
  const { status } = searchStore

  let results = searchStore.results

  if (searchStore.status === 'loading' && results.length === 0) {
    results = [
      {
        isPlaceholder: true,
        meta: null as any,
        id: '',
        slug: '',
      },
    ]
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
        renderAheadOffset={600}
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
  const media = useMedia()
  const curProps = useContext(SearchPagePropsContext)!
  const { title, subTitle } = getTitleForState(curProps.item, {
    lowerCase: false,
  })
  const lenseColor = useCurrentLenseColor()
  return (
    <>
      <VStack paddingTop={media.sm ? 12 : 12 + 52 + 10} />
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
          <SearchPageTitle />
          <SearchPageScoring />
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

const SearchPageScoring = memo(() => {
  const curProps = useContext(SearchPagePropsContext)!
  const theme = useTheme()
  const meta = searchPageStore.meta
  const activeTags = getActiveTags(curProps.item)
  const weights = activeTags.map((tag) => {
    return !meta
      ? 1
      : meta.main_tag === tag.slug?.replace('lenses__', '')
      ? meta.scores.weights.main_tag * 2
      : meta.scores.weights.rishes * 2
  })
  const totalWeight = weights.reduce((a, c) => a + c, 0)
  const tagsWithPct = sortBy(
    activeTags.map((tag, i) => {
      return {
        pct: Math.round((weights[i] / totalWeight) * 100),
        tag,
      }
    }),
    (x) => -x.pct
  )

  return (
    <HStack alignItems="center">
      <HStack flex={1} position="relative">
        <HStack position="absolute" fullscreen>
          {/* arrow line */}
          <VStack
            borderLeftWidth={2}
            borderColor={theme.borderColor}
            minWidth={40}
            minHeight={40}
            marginBottom={-40}
            marginRight={-20}
            borderRadius={40}
            marginLeft={20}
            transform={[{ rotate: '45deg' }]}
          />
          <AbsoluteVStack
            bottom={-32}
            left={15}
            transform={[{ rotate: '180deg' }]}
          >
            <Svg width={12} height={12} viewBox="0 0 100 100">
              <Polygon points="50 15, 100 100, 0 100" fill="#ddd" />
            </Svg>
          </AbsoluteVStack>
          <VStack
            borderBottomWidth={2}
            transform={[{ translateY: -1 }]}
            borderBottomColor={theme.borderColor}
            flex={1}
          />
        </HStack>
      </HStack>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxWidth: '100%', alignSelf: 'center' }}
      >
        <HStack
          alignItems="center"
          borderWidth={1}
          borderColor={theme.borderColor}
          paddingHorizontal={18}
          borderRadius={100}
          marginLeft={100}
          marginRight={30}
          height={48}
          position="relative"
        >
          <AbsoluteVStack left={-66}>
            <SlantedTitle size="xs">Scoring</SlantedTitle>
          </AbsoluteVStack>

          <HStack spacing="sm">
            {tagsWithPct.map(({ tag, pct }, index) => {
              return (
                <TagButton
                  key={tag.slug ?? index}
                  replaceSearch
                  size="sm"
                  {...getTagButtonProps(tag)}
                  after={`(${pct}%)`}
                />
              )
            })}
          </HStack>
        </HStack>
      </ScrollView>

      <HStack flex={1} />
    </HStack>
  )
})

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
  return useQueryLoud(key, () => getTagsFromRoute(route), {
    suspense: false,
  })
}
