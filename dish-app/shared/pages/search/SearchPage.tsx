import { ArrowUp } from '@dish/react-feather'
import { sleep } from '@o/async'
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
} from 'snackui'

import { AppPortalItem } from '../../AppPortal'
import { isWeb } from '../../constants'
import { rgbString } from '../../helpers/rgbString'
import { useAppDrawerWidth } from '../../hooks/useAppDrawerWidth'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
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
import { getLocationFromRoute } from '../../state/home-location.helpers'
import {
  HomeActiveTagsRecord,
  HomeStateItemSearch,
} from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { omStatic } from '../../state/omStatic'
import { router } from '../../state/router'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackCloseButton, StackDrawer } from '../../views/StackDrawer'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
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

const loadSearchPage: PageLoadEffectCallback = ({ isRefreshing, item }) => {
  // if initial load on a search page, process url => state
  let isCancelled = false

  if (isRefreshing) {
    omStatic.actions.home.runSearch({ force: true })
    return
  }

  getLocationFromRoute().then((location) => {
    if (isCancelled) return
    // TODO UPDATE HOME TOO...
    omStatic.actions.home.updateCurrentState({
      ...location,
    })
    getTagsFromRoute(router.curPage).then((tags) => {
      if (isCancelled) return
      addTagsToCache(tags)
      const activeTags: HomeActiveTagsRecord = tags.reduce<any>((acc, tag) => {
        acc[getTagSlug(tag)] = true
        return acc
      }, {})
      const searchQuery = decodeURIComponent(router.curPage.params.search ?? '')
      console.log('activeTags', activeTags, item, searchQuery, 'run search')
      omStatic.actions.home.updateActiveTags({
        ...item,
        searchQuery,
        activeTags,
      })
      omStatic.actions.home.runSearch()
    })
  })

  return () => {
    isCancelled = true
  }
}

export default memo(function SearchPage(props: Props) {
  // const isEditingUserList = !!isEditingUserPage(om.state)
  const om = useOvermind()
  const state = om.state.home.allStates[props.item.id] as HomeStateItemSearch
  const isOptimisticUpdating = om.state.home.isOptimisticUpdating
  const wasOptimisticUpdating = useLastValue(isOptimisticUpdating)

  const changingFilters = wasOptimisticUpdating && state.status === 'loading'
  const shouldAvoidContentUpdates =
    isOptimisticUpdating || !props.isActive || changingFilters

  usePageLoadEffect(props, loadSearchPage)

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
    <VStack position="relative" height="100%">
      <StackCloseButton />
      <SearchNavBarContainer isActive={props.isActive} id={props.item.id} />
      <StackDrawer>
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
  const isSmall = useIsNarrow()

  if (!isSmall) {
    return (
      <>
        <SearchPageNavBar id={id} />
        <VStack width={100} height={10} />
      </>
    )
  }

  let contents = <SearchPageNavBar id={id} />

  if (!isWeb) {
    contents = (
      <AbsoluteVStack pointerEvents="none" bottom={0} height={150} width="100%">
        {contents}
      </AbsoluteVStack>
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
    const titleLen = (title + subTitle).length
    const titleScale =
      titleLen > 80
        ? 0.6
        : titleLen > 70
        ? 0.7
        : titleLen > 60
        ? 0.8
        : titleLen > 50
        ? 0.9
        : 1
    const titleFontSize = 26 * titleScale * (isSmall ? 0.75 : 1)
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

    return (
      <VStack onLayout={handleLayout} flex={1}>
        <ContentScrollView
          id="search"
          ref={combineRefs(ref, scrollRef)}
          {...props}
        >
          <HStack
            paddingHorizontal={15}
            paddingTop={isSmall ? 12 : 12 + 52 + 10}
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
              fontWeight="700"
              color={rgbString(lenseColor.map((x) => x * 0.92))}
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
            <VStack backgroundColor="#f2f2f2" height={1} flex={1} />
          </HStack>

          <Suspense fallback={null}>
            <SearchPageResultsInfoBox state={curProps.item} />
          </Suspense>

          <HStack>
            {getActiveTags(curProps.item).map((tag) => {
              return (
                <TagButton
                  replaceSearch
                  size="sm"
                  {...getTagButtonProps(tag)}
                />
              )
            })}
          </HStack>

          <VStack position="relative" flex={1} minHeight={600}>
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
