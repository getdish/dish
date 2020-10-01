import { sleep } from '@dish/async'
import { ArrowUp } from '@dish/react-feather'
import {
  AbsoluteVStack,
  AnimatedVStack,
  Button,
  HStack,
  LinearGradient,
  LoadingItem,
  Spacer,
  StackProps,
  Text,
  VStack,
  combineRefs,
} from '@dish/ui'
import { useStore } from '@dish/use-store'
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

import { AppPortalItem } from '../../AppPortal'
import { isWeb, searchBarTopOffset } from '../../constants'
import { rgbString } from '../../helpers/rgbString'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
import { useLastValue } from '../../hooks/useLastValue'
import { useLastValueWhen } from '../../hooks/useLastValueWhen'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { addTagsToCache } from '../../state/allTags'
import { getFullTags } from '../../state/getFullTags'
import { getTagId } from '../../state/getTagId'
import { getTagsFromRoute } from '../../state/getTagsFromRoute'
import { getLocationFromRoute } from '../../state/home-location.helpers'
import {
  HomeActiveTagsRecord,
  HomeStateItemSearch,
} from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { omStatic } from '../../state/omStatic'
import { router } from '../../state/router'
import {
  ScrollStore,
  setIsScrollAtTop,
  usePreventContentScroll,
} from '../../views/ContentScrollView'
import { HomeLenseBar } from '../../views/HomeLenseBar'
import { StackDrawer } from '../../views/StackDrawer'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import {
  ITEM_HEIGHT,
  RestaurantListItem,
} from '../restaurant/RestaurantListItem'
import { StackViewProps } from '../StackViewProps'
import { getTitleForState } from './getTitleForState'
import { SearchPageNavBar } from './SearchPageNavBar'
import { SearchPageResultsInfoBox } from './SearchPageResultsInfoBox'
import { titleHeight } from './titleHeight'

type Props = StackViewProps<HomeStateItemSearch>

const SearchPagePropsContext = createContext<Props | null>(null)

export default memo(function SearchPage(props: Props) {
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const om = useOvermind()
  const state = om.state.home.allStates[props.item.id] as HomeStateItemSearch
  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  const wasOptimisticUpdating = useLastValue(isOptimisticUpdating)

  const changingFilters = wasOptimisticUpdating && state.status === 'loading'
  const shouldAvoidContentUpdates =
    isOptimisticUpdating || !props.isActive || changingFilters

  usePageLoadEffect(props.isActive, ({ isRefreshing }) => {
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
        addTagsToCache(tags)
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
    return (
      <SearchPagePropsContext.Provider value={props}>
        <SearchResultsContent {...props} item={state} />
      </SearchPagePropsContext.Provider>
    )
  }, [key])

  return (
    <>
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
    </>
  )
})

const SearchNavBarContainer = ({
  isActive,
  id,
}: {
  isActive: boolean
  id: string
}) => {
  const isSmall = useIsNarrow()

  if (!isSmall) {
    return (
      <VStack marginTop={10}>
        <SearchPageNavBar id={id} />
      </VStack>
    )
  }

  let contents = <SearchPageNavBar id={id} />

  if (!isWeb) {
    contents = (
      <AnimatedVStack>
        <AbsoluteVStack
          pointerEvents="none"
          bottom={0}
          height={150}
          width="100%"
        >
          <LinearGradient
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.25)']}
          />
          {contents}
        </AbsoluteVStack>
      </AnimatedVStack>
    )
  }

  return (
    <AppPortalItem key={isActive ? '1' : '0'}>
      {isActive ? contents : null}
    </AppPortalItem>
  )
}

// prevent warning
delete RecyclerListView.propTypes['externalScrollView']

const SearchResultsContent = (props: Props) => {
  const searchState = props.item
  const drawerWidth = useAppDrawerWidth()
  const allResults = searchState.results
  const scrollRef = useRef<ScrollView | null>(null)
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
        style={{ flex: 1, height: '100%' }}
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
    const isSmall = useIsNarrow()
    const { title, subTitle, pageTitleElements } = getTitleForState(
      curProps.item,
      {
        lowerCase: false,
      }
    )
    const paddingTop = isSmall ? 2 : titleHeight
    const titleLen = (title + subTitle).length
    const titleScale =
      titleLen > 70 ? 0.75 : titleLen > 60 ? 0.85 : titleLen > 50 ? 0.95 : 1
    const titleFontSize = 38 * titleScale * (isSmall ? 0.75 : 1)
    const lenseColor = useCurrentLenseColor()
    const scrollRef = useRef<ScrollView>()
    const preventScrolling = usePreventContentScroll()
    const scrollStore = useStore(ScrollStore)
    const tm = useRef<any>(0)

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

    return (
      <VStack onLayout={handleLayout} flex={1}>
        <ScrollView
          scrollEventThrottle={100}
          ref={combineRefs(ref, scrollRef)}
          {...props}
          scrollEnabled={preventScrolling ? false : props.scrollEnabled ?? true}
          disableScrollViewPanResponder={
            preventScrolling
              ? true
              : props.disableScrollViewPanResponder ?? false
          }
          onScroll={(e) => {
            const y = e.nativeEvent.contentOffset.y
            setIsScrollAtTop(y <= 0)
            props.onScroll?.(e)
            // perf issue i believe
            if (!scrollStore.isScrolling) {
              scrollStore.setIsScrolling(true)
            }
            clearTimeout(tm.current)
            tm.current = setTimeout(() => {
              scrollStore.setIsScrolling(false)
            }, 200)
          }}
        >
          <VStack width="100%" height={paddingTop} />
          <HStack
            paddingHorizontal={20}
            paddingTop={10}
            paddingBottom={15}
            overflow="hidden"
          >
            <Text
              marginVertical="auto"
              letterSpacing={-0.5}
              fontSize={titleFontSize}
              fontWeight="500"
              color={rgbString(lenseColor.map((x) => x * 0.8))}
              // @ts-ignore
              display="inline" // safari fix
              marginRight={isSmall ? 20 : 0}
            >
              {pageTitleElements}{' '}
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
          </HStack>
          <Suspense fallback={null}>
            <SearchPageResultsInfoBox state={curProps.item} />
          </Suspense>
          <VStack position="relative" flex={1} minHeight={600}>
            {children}
          </VStack>
          <Suspense fallback={null}>
            <SearchFooter
              searchState={curProps.item}
              scrollToTop={scrollToTopHandler}
            />
          </Suspense>
        </ScrollView>
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
      {isWeb && (
        <>
          <HStack alignItems="center" justifyContent="center">
            <HomeLenseBar size="lg" activeTagIds={searchState.activeTagIds} />
          </HStack>
          <Spacer size={40} />
        </>
      )}
      <Button
        alignSelf="center"
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
