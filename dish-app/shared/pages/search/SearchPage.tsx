import { sleep } from '@dish/async'
import { ArrowDown, ArrowUp } from '@dish/react-feather'
import { HistoryItem } from '@dish/router'
import { useStore } from '@dish/use-store'
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
import { Dimensions, ScrollView, ScrollViewProps } from 'react-native'
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
  VStack,
  combineRefs,
  useMedia,
} from 'snackui'

import { AppPortalItem } from '../../AppPortal'
import { isWeb } from '../../constants'
import { bboxToSpan } from '../../helpers/bboxToSpan'
import { fetchRegion } from '../../helpers/fetchRegion'
import { rgbString } from '../../helpers/rgbString'
import { searchLocations } from '../../helpers/searchLocations'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useLastValue } from '../../hooks/useLastValue'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import {
  PageLoadEffectCallback,
  usePageLoadEffect,
} from '../../hooks/usePageLoadEffect'
import { addTagsToCache } from '../../state/allTags'
import { getActiveTags } from '../../state/getActiveTags'
import { getTagsFromRoute } from '../../state/getTagsFromRoute'
import { getTagSlug } from '../../state/getTagSlug'
import {
  HomeActiveTagsRecord,
  HomeStateItemSearch,
} from '../../state/home-types'
import { HomeStateItemLocation } from '../../state/HomeStateItemLocation'
import { initialHomeState } from '../../state/initialHomeState'
import { omStatic } from '../../state/omStatic'
import { SearchRouteParams, router } from '../../state/router'
import { SearchResultsStore } from '../../state/searchResult'
import { useOvermind } from '../../state/useOvermind'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import {
  ITEM_HEIGHT,
  RestaurantListItem,
} from '../restaurant/RestaurantListItem'
import { StackViewProps } from '../StackViewProps'
import { getTitleForState } from './getTitleForState'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'

type Props = StackViewProps<HomeStateItemSearch>
const SearchPagePropsContext = createContext<Props | null>(null)

export default memo(function SearchPage(props: Props) {
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const om = useOvermind()
  const state = props.item
  const location = useLocationFromRoute()
  const tags = useTagsFromRoute()

  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  const wasOptimisticUpdating = useLastValue(isOptimisticUpdating)
  const changingFilters = wasOptimisticUpdating && state.status === 'loading'
  const shouldAvoidContentUpdates =
    isOptimisticUpdating || !props.isActive || changingFilters

  usePageLoadEffect(props, ({ isRefreshing }) => {
    if (isRefreshing) {
      om.actions.home.runSearch({ force: true })
    }
  })

  useEffect(() => {
    if (!location.data) return
    const searchItem: HomeStateItemSearch = {
      ...props.item,
      center: location.data.center,
      span: location.data.span,
    }
    om.actions.home.updateCurrentState(searchItem)
  }, [location.data])

  useEffect(() => {
    if (!tags.data) return
    addTagsToCache(tags.data)
    const activeTags: HomeActiveTagsRecord = tags.data.reduce((acc, tag) => {
      acc[getTagSlug(tag)] = true
      return acc
    }, {})
    const searchQuery = decodeURIComponent(router.curPage.params.search ?? '')
    omStatic.actions.home.updateActiveTags({
      ...props.item,
      searchQuery,
      activeTags,
    })
    om.actions.home.runSearch({})
  }, [tags.data])

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
  }, [])

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
    return (
      <SearchPagePropsContext.Provider value={props}>
        <SearchResultsContent {...props} item={state} />
      </SearchPagePropsContext.Provider>
    )
  }, [key])

  return (
    <VStack position="relative" height="100%">
      <StackDrawer closable>
        <SearchNavBarContainer isActive={props.isActive} id={props.item.id} />
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
      </StackDrawer>
    </VStack>
  )
})

const SearchNavBarContainer = ({
  isActive,
  id,
}: {
  isActive: boolean
  id: string
}) => {
  const media = useMedia()
  let contents = <SearchPageNavBar id={id} />

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

  return (
    <AppPortalItem key={isActive ? '1' : '0'}>
      {!!isActive && <>{contents}</>}
    </AppPortalItem>
  )
}

// prevent warning
delete RecyclerListView.propTypes['externalScrollView']

const SearchResultsContent = (props: Props) => {
  const searchState = props.item
  const drawerWidth = useAppDrawerWidth()
  const allResults = searchState.results
  const { title } = getTitleForState(searchState, {
    lowerCase: false,
  })

  const dataProvider = useMemo(() => {
    return new DataProvider((r1, r2) => {
      return r1.id !== r2.id
    }).cloneWithRows(allResults)
  }, [allResults])

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

  const rowRenderer = useCallback((
    type: string | number,
    data: any,
    index: number
    // extendedState?: object
  ) => {
    return (
      <Suspense fallback={<LoadingItem size="lg" />}>
        <RestaurantListItem
          currentLocationInfo={searchState.currentLocationInfo ?? null}
          restaurantId={data.id}
          restaurantSlug={data.slug}
          rank={index + 1}
          searchState={searchState}
        />
      </Suspense>
    )
  }, [])

  const searchResultsStore = useStore(SearchResultsStore)

  useEffect(() => {
    const searchResultsPositions: Record<string, number> = {}
    searchState.results.forEach((v, index) => {
      searchResultsPositions[v.id] = index + 1
    })
    searchResultsStore.setRestaurantPositions(searchResultsPositions)
  }, [searchState.results])

  if (searchState.status !== 'loading' && searchState.results.length === 0) {
    return (
      <>
        <PageTitleTag>{title}</PageTitleTag>
        <VStack
          margin="auto"
          paddingVertical={100}
          alignItems="center"
          justifyContent="center"
          spacing
        >
          <Text fontSize={22}>No results</Text>
          <Text>😞</Text>
        </VStack>
      </>
    )
  }

  return (
    <>
      <PageTitleTag>{title}</PageTitleTag>
      <RecyclerListView
        style={{
          flex: 1,
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

const SearchPageScrollView = forwardRef<ScrollView, SearchPageScrollViewProps>(
  ({ children, onSizeChanged, ...props }, ref) => {
    const curProps = useContext(SearchPagePropsContext)
    const media = useMedia()
    const { title, subTitle, pageName } = getTitleForState(curProps.item, {
      lowerCase: false,
    })
    const titleLen = (title + subTitle).length
    const titleScale =
      titleLen > 65
        ? 0.7
        : titleLen > 55
        ? 0.75
        : titleLen > 45
        ? 0.85
        : titleLen > 35
        ? 0.95
        : 1
    const titleFontSize = 28 * titleScale * (media.sm ? 0.75 : 1)
    const lenseColor = useCurrentLenseColor()
    const scrollRef = useRef<ScrollView>()

    useEffect(() => {
      return omStatic.reaction(
        (state) => state.home.activeIndex,
        (index) => {
          if (
            omStatic.state.home.activeEvent === 'pin' ||
            omStatic.state.home.activeEvent === 'key'
          ) {
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

    const meta = curProps.item.meta
    const activeTags = getActiveTags(curProps.item)
    const weights = activeTags.map((tag) => {
      return !meta
        ? 1
        : meta.main_tag === tag.slug.replace('lenses__', '')
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
      <VStack onLayout={handleLayout} flex={1}>
        <ContentScrollView
          id="search"
          ref={combineRefs(ref, scrollRef)}
          {...props}
        >
          <HStack
            paddingHorizontal={15}
            // TODO snackui verify working
            paddingTop={media.sm ? 12 : 12 + 52 + 10}
            paddingBottom={12}
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            spacing="xl"
          >
            <VStack backgroundColor="#f2f2f2" height={1} flex={1} />
            <Text
              textAlign="center"
              letterSpacing={-0.25}
              fontSize={titleFontSize}
              fontWeight="800"
              color={rgbString(lenseColor.map((x) => x * 0.92))}
            >
              {pageName}{' '}
              <Text
                // @ts-ignore
                display="inline" // safari fix
                fontWeight="300"
                opacity={0.5}
                className="nobreak"
              >
                {subTitle}
              </Text>
            </Text>
            <VStack backgroundColor="#f2f2f2" height={1} flex={1} />
          </HStack>

          <Suspense fallback={null}>
            <SearchPageResultsInfoBox state={curProps.item} />
          </Suspense>

          <HStack alignItems="center">
            <HStack flex={1} position="relative">
              <HStack position="absolute" fullscreen>
                <VStack
                  borderLeftWidth={2}
                  borderColor="#eee"
                  width={40}
                  height={40}
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
                  borderBottomColor="#eee"
                  flex={1}
                />
              </HStack>
            </HStack>
            <HStack
              alignItems="center"
              borderWidth={1}
              borderColor="#f2f2f2"
              paddingHorizontal={18}
              borderRadius={100}
              maxWidth="80%"
              height={52}
              position="relative"
            >
              <AbsoluteVStack left={-65}>
                <SlantedTitle size="xs">Scoring</SlantedTitle>
              </AbsoluteVStack>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ maxWidth: 300 }}
              >
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
              </ScrollView>
            </HStack>
            <HStack flex={1} />
          </HStack>

          <VStack position="relative" flex={10} minHeight={600}>
            {children}
          </VStack>

          <Suspense fallback={null}>
            <SearchFooter
              searchState={curProps.item}
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

function useLocationFromRoute() {
  const key = `location-${router.curPage.name + router.curPage.params.region}`
  return useQueryLoud(key, () => getLocationFromRoute())
}

async function getLocationFromRoute(): Promise<HomeStateItemLocation | null> {
  const page = router.curPage

  if (page.name === 'search') {
    const params = page.params as SearchRouteParams

    if (params.region === 'here') {
      // TODO get from localStorage or set to default sf
      return null
    }

    // lat _ lng _ span
    if (+params.region[0] >= 0) {
      const [latStr, lngStr, spanStr] = params.region.split('_')
      return {
        center: {
          lat: +latStr,
          lng: +lngStr,
        },
        span: {
          lat: +spanStr,
          lng: +spanStr,
        },
      }
    }

    // find by slug
    const region = await fetchRegion(params.region)
    if (region) {
      return {
        center: region.center,
        span: region.span,
        region,
      }
    }

    // ?? old find by slug
    const locations = await searchLocations(params.region.split('-').join(' '))
    if (locations.length) {
      const [nearest] = locations
      return {
        center: nearest.center,
        span: bboxToSpan(nearest.bbox),
      }
    }
  }

  return {
    center: initialHomeState.center,
    span: initialHomeState.span,
  }
}

function useTagsFromRoute() {
  const curPage = router.curPage as HistoryItem<'search'>
  const key = `tags-${Object.values(curPage).join(',')}`
  return useQueryLoud(key, () => getTagsFromRoute(curPage))
}
