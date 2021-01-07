import {
  LngLat,
  RestaurantOnlyIds,
  SEARCH_DOMAIN,
  TopCuisine,
  getHomeDishes,
  graphql,
  order_by,
  query,
  tag,
} from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { capitalize, chunk, partition, sortBy, uniqBy, zip } from 'lodash'
import React, {
  Suspense,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import {
  AbsoluteVStack,
  HStack,
  InteractiveContainer,
  LoadingItems,
  Spacer,
  StackProps,
  Text,
  Theme,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'
import { isWeb } from 'snackui/src/constants'

import { peachAvatar } from '../../constants/avatar'
import { drawerWidthMax, searchBarHeight } from '../../constants/constants'
import { RegionNormalized, useRegionQuery } from '../../helpers/fetchRegion'
import { setDefaultLocation } from '../../helpers/getDefaultLocation'
import { getGroupedButtonProps } from '../../helpers/getGroupedButtonProps'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { router } from '../../router'
import { HomeStateItemHome } from '../../types/homeTypes'
import { AppIntroLogin } from '../AppIntroLogin'
import { useSetAppMapResults } from '../AppMapStore'
import { homeStore, useHomeStore } from '../homeStore'
import { usePageLoadEffect } from '../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../hooks/useRestaurantQuery'
import { CardFrame, cardFrameBorderRadius } from '../views/CardFrame'
import { CommentBubble } from '../views/CommentBubble'
import { ContentScrollView } from '../views/ContentScrollView'
import { DishView } from '../views/dish/DishView'
import { DishHorizonView } from '../views/DishHorizonView'
import { Link } from '../views/Link'
import { LinkButton } from '../views/LinkButton'
import { LinkButtonProps } from '../views/LinkProps'
import { PageTitleTag } from '../views/PageTitleTag'
import { SlantedTitle } from '../views/SlantedTitle'
import {
  FeedItemCuisine,
  FeedItemDish,
  FeedItemDishRestaurants,
  FeedItemRestaurant,
  FeedItems,
} from './FeedItems'
import { HomeStackViewProps } from './HomeStackViewProps'
import { HomeTopSearches } from './HomeTopSearches'
import { RestaurantButton } from './restaurant/RestaurantButton'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { PageTitle } from './search/PageTitle'

type Props = HomeStackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const home = useHomeStore()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const state = home.allStates[props.item.id]
  const region = useRegionQuery(state.region, {
    enabled: !!state.region,
  })

  console.log('👀 HomePage', props, region, JSON.stringify(state, null, 2))

  // load effect!
  usePageLoadEffect(props, () => {
    // default navigate to a region (TODO make it the nearest one to current map..)
    if (!props.item.region) {
      console.warn('no region, navigate to san francisco')
      router.navigate({
        name: 'homeRegion',
        params: {
          region: 'ca-san-francisco',
        },
      })
    }
  })

  // center map to region
  // ONLY on first load!
  useEffect(() => {
    if (!region.data) return
    if (isLoaded) return
    const { center, span } = region.data
    if (!center || !span) return
    home.updateCurrentState('HomePage.centerMapToRegion', {
      center,
      span,
    })
    setIsLoaded(true)
  }, [isLoaded, region.data])

  useEffect(() => {
    if (!props.isActive) return
    if (region.status !== 'success') return
    if (!region.data) {
      // no region found!
      router.navigate({
        name: 'homeRegion',
        params: {
          region: 'ca-san-francisco',
        },
      })
    } else {
      setDefaultLocation({
        center: region.data.center,
        span: region.data.span,
        region: region.data.name,
      })
    }
  }, [props.isActive, region.data])

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (props.isActive && isLoaded) {
      home.clearSearch()
      home.clearTags()
    }
  }, [props.isActive])

  const regionName = (() => {
    let next =
      (region.data?.name ?? '')
        .toLowerCase()
        .replace(/[a-z]{2}\- /i, '')
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ') ?? ''
    if (next === '') return '...'
    return next
  })()

  const navLinks: LinkButtonProps[] = [
    {
      name: 'homeRegion',
      params: { region: state.region, section: '' },
      children: 'Unique',
    },
    {
      name: 'homeRegion',
      params: { region: state.region, section: 'new' },
      children: 'New',
    },
  ]

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>

      {/* TOP FADE */}
      <AbsoluteVStack
        top={-searchBarHeight + 11}
        right={0}
        left={0}
        overflow="hidden"
        height={searchBarHeight}
        zIndex={10}
        opacity={props.isActive ? 1 : 0}
        pointerEvents="none"
      >
        <AbsoluteVStack
          bottom={10}
          left={0}
          right={0}
          shadowColor={theme.backgroundColor}
          shadowOpacity={1}
          shadowRadius={10}
          borderBottomColor={theme.backgroundColorSecondary}
          borderBottomWidth={1}
          height={searchBarHeight + 10}
        />
      </AbsoluteVStack>

      <VStack
        flex={1}
        width="100%"
        maxHeight="100%"
        overflow="hidden"
        maxWidth={drawerWidthMax}
        alignSelf="flex-end"
      >
        <ContentScrollView id="home">
          <AbsoluteVStack
            opacity={0.05}
            top={0}
            right={0}
            left={0}
            height={700}
          >
            <DishHorizonView />
          </AbsoluteVStack>
          <VStack flex={1} overflow="hidden" maxWidth="100%">
            <VStack>
              <HomeTopSpacer />

              <Spacer size="md" />

              <HStack>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack paddingVertical={15} paddingHorizontal={10}>
                    <SlantedTitle
                      position="relative"
                      overflow="visible"
                      minWidth={80}
                      alignSelf="center"
                      marginTop={-5}
                    >
                      {regionName}
                    </SlantedTitle>
                    <HomeTopSearches />
                  </HStack>
                </ScrollView>
              </HStack>

              {/* <VStack alignItems="center">
                <InteractiveContainer borderRadius={10}>
                  {navLinks.map((linkProps, index) => {
                    const isActive = state.section === linkProps.params.section
                    return (
                      <LinkButton
                        key={index}
                        textProps={{
                          color: isActive ? 'red' : '#888',
                          fontWeight: '500',
                        }}
                        {...getGroupedButtonProps({
                          index,
                          items: navLinks,
                          borderRadius: 10,
                        })}
                        {...linkProps}
                      />
                    )
                  })}
                </InteractiveContainer>
              </VStack> */}

              <Spacer size="lg" />

              <Spacer />
              <Suspense
                fallback={
                  <>
                    <LoadingItems />
                    <LoadingItems />
                  </>
                }
              >
                <HomePageContent {...props} region={region.data} />
              </Suspense>
            </VStack>
          </VStack>
        </ContentScrollView>
      </VStack>
    </>
  )
})

const HomeTopSpacer = () => {
  const media = useMedia()
  return (
    <VStack
      pointerEvents="none"
      marginTop={5}
      height={media.sm ? 0 : searchBarHeight}
    />
  )
}

const isRestaurantFeedItem = (x: FeedItems): x is FeedItemRestaurant =>
  x.type === 'restaurant'

const HomePageContent = memo(
  graphql(function HomePageContent({
    region,
    item,
    isActive,
  }: Props & {
    region?: RegionNormalized
    item: HomeStateItemHome
  }) {
    const media = useMedia()
    const isNew = item.section === 'new'
    const items = useHomeFeed(item, region, isNew)
    const isLoading = !region || items[0]?.id === null

    useSetAppMapResults({
      isActive,
      results: items.filter(isRestaurantFeedItem).map((x) => x.restaurant),
    })

    const [expandable, unexpandable] = partition(items, (x) => x.expandable)
    const unshuffled = zip(expandable, unexpandable).flat().slice(0, 12)
    const shuffled = chunk(unshuffled, 2)
      .map((chunk, i) => (i % 2 === 1 ? [chunk[1], chunk[0]] : chunk))
      .flat()
      .filter(isPresent)
    const allItems = shuffled

    return (
      <>
        {isLoading && (
          <>
            <LoadingItems />
            <LoadingItems />
          </>
        )}

        {!isLoading && (
          <Suspense fallback={null}>
            <VStack
              paddingBottom={100}
              minHeight={Dimensions.get('window').height * 0.9}
            >
              <HStack
                justifyContent="center"
                flexWrap="wrap"
                maxWidth={830}
                alignSelf="center"
                paddingHorizontal={media.xl ? '3%' : 0}
              >
                {allItems.map((item, index) => {
                  const content = (() => {
                    switch (item.type) {
                      case 'restaurant':
                        return <RestaurantFeedCard {...item} />
                      case 'dish':
                        return <DishFeedCard {...item} />
                      case 'dish-restaurants':
                        return <DishRestaurantsFeedCard {...item} />
                      case 'cuisine':
                        return <CuisineFeedCard {...item} />
                    }
                  })()
                  if (!content) {
                    return null
                  }
                  return (
                    <VStack
                      key={item.id}
                      paddingHorizontal={16}
                      paddingBottom="6%"
                      alignItems="center"
                      width={media.xs ? '90%' : 'auto'}
                    >
                      <CardFrame
                        transparent={item.transparent}
                        expandable={item.expandable}
                      >
                        {content}
                      </CardFrame>
                    </VStack>
                  )
                })}
              </HStack>
            </VStack>

            {/* pad bottom */}
            <VStack height={20} />

            <HomePageFooter />
          </Suspense>
        )}
      </>
    )
  })
)

const useTopCuisines = (center: LngLat) => {
  return useQuery('topcuisine', () => getHomeCuisines(center))
}

function useHomeFeed(
  item: HomeStateItemHome,
  region?: RegionNormalized,
  isNew?: boolean
) {
  const slug = item.region ?? ''
  const homeFeed = useQueryLoud<{
    trending: RestaurantOnlyIds[]
    newest: RestaurantOnlyIds[]
  }>(
    `HOMEFEEDQUERY-${slug}`,
    () =>
      fetch(
        `${SEARCH_DOMAIN}/feed?region=${encodeURIComponent(slug)}&limit=20`
      ).then((res) => res.json()),
    { enabled: !!item.region }
  )

  const feedRestaurants = homeFeed.data?.[isNew ? 'new' : 'trending'] ?? []
  const bbox = region?.bbox
  const backupRestaurants = bbox
    ? query
        .restaurant({
          where: {
            location: {
              _st_within: bbox,
            },
            downvotes: { _is_null: false },
            votes_ratio: { _is_null: false },
          },
          order_by: [{ votes_ratio: order_by.desc }],
          limit: 10,
        })
        .map((x) => ({ id: x.id, slug: x.slug }))
    : []

  const restaurants = uniqBy(
    [...feedRestaurants, ...backupRestaurants],
    (x) => x.id
  )

  // console.log('feed', slug, bbox, restaurants)

  const cuisines = useTopCuisines(item.center)

  const dishes = query.tag({
    where: {
      type: {
        _eq: 'dish',
      },
    },
    order_by: [{ popularity: order_by.desc }],
    limit: 8,
  })

  let items: FeedItems[] =
    !region || !item.region
      ? []
      : [
          ...dishes.map(
            (dish, index): FeedItems => {
              return {
                id: `dish-${dish.id}`,
                type: 'dish',
                expandable: false,
                rank: Math.random() * 10,
                transparent: true,
                restaurant: {
                  id: restaurants[0]?.id ?? '',
                  slug: restaurants[0]?.slug ?? '',
                },
                dish: {
                  id: dish.id ?? '',
                  slug: dish.slug ?? '',
                  name: dish.name ?? '',
                  icon: dish.icon ?? '',
                  image: dish.default_images()?.[0] ?? '',
                  score: 100,
                },
              } as const
            }
          ),
          ...dishes.map(
            (dish, index): FeedItems => {
              return {
                id: `dish-restaurant-${dish.id}`,
                type: 'dish-restaurants',
                expandable: true,
                rank: index + (index % 2 ? 10 : 0),
                dish: {
                  id: dish.id ?? '',
                  slug: dish.slug ?? '',
                  name: dish.name ?? '',
                  icon: dish.icon ?? '',
                  image: dish.default_images()?.[0] ?? '',
                },
                restaurants: restaurants.map((r) => {
                  return {
                    id: r.id,
                    slug: r.slug,
                  }
                }),
              } as const
            }
          ),
          ...(cuisines.data ?? []).map(
            (item, index): FeedItems => {
              return {
                id: `cuisine-${item.country}`,
                type: 'cuisine',
                expandable: true,
                rank: index + (index % 3 ? 30 : 0),
                ...item,
              } as const
            }
          ),
          ...restaurants.map(
            (item, index): FeedItems => {
              return {
                id: `restaurant-${item.id}`,
                expandable: false,
                type: 'restaurant',
                rank: index,
                restaurant: {
                  id: item.id,
                  slug: item.slug,
                },
              } as const
            }
          ),
        ]

  items = items.filter((x) => x.id)
  items = sortBy(items, (x) => x.rank)
  items = uniqBy(items, (x) => x.id)

  return items
}

const CuisineFeedCard = graphql(function CuisineFeedCard(
  props: FeedItemCuisine
) {
  const scrollRef = useRef<ScrollView>()
  const dishes = props.dishes
    ? query.tag({
        where: {
          name: {
            _in: props.dishes.map((x) => x.name),
          },
        },
        order_by: [{ popularity: order_by.desc }],
      })
    : []

  const restaurants = props.dishes?.[0]?.best_restaurants ?? []
  const perCol = 2

  return (
    <VStack height="100%" maxWidth="100%">
      <AbsoluteVStack zIndex={10} top={-5} left={-5}>
        <SlantedTitle>
          {props.country} {props.icon}
        </SlantedTitle>
      </AbsoluteVStack>
      <ScrollView
        ref={scrollRef}
        style={{ maxWidth: '100%', overflow: 'hidden' }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <VStack paddingTop={63} paddingHorizontal={20}>
          <HStack flexWrap="nowrap">
            <DishCol>{dishes.slice(0, perCol).map(getDishColInner)}</DishCol>
            <DishCol transform={[{ translateY: -15 }]}>
              {dishes.slice(perCol, perCol * 2).map(getDishColInner)}
            </DishCol>
            <DishCol transform={[{ translateY: -30 }]}>
              {dishes.slice(perCol * 2, perCol * 3).map(getDishColInner)}
            </DishCol>
            <DishCol transform={[{ translateY: -45 }]}>
              {dishes.slice(perCol * 3, perCol * 4).map(getDishColInner)}
            </DishCol>
          </HStack>
        </VStack>
      </ScrollView>

      {/* <AbsoluteVStack bottom={0} left={0} backgroundColor="#fff">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ maxWidth: '100%', overflow: 'hidden' }}
        >
          <VStack padding={5}>
            <HStack spacing={5}>
              {restaurants.slice(0, 3).map(getRestaurantButton)}
            </HStack>
            <Spacer size="sm" />
            <HStack spacing={5}>
              {restaurants.slice(2, 5).map(getRestaurantButton)}
            </HStack>
          </VStack>
        </ScrollView>
      </AbsoluteVStack> */}
    </VStack>
  )
})

// const getRestaurantButton = (r, i) => {
//   if (!r.slug) {
//     return null
//   }
//   return (
//     <RestaurantButton
//       subtle
//       key={r.id}
//       trending="up"
//       // rank={0}
//       restaurantSlug={r.slug}
//     />
//   )
// }

const getDishColInner = (dish: tag, i: number) => {
  return (
    <VStack marginBottom={5} key={i}>
      <DishView isFallback size={130} dish={selectTagDishViewSimple(dish)} />
    </VStack>
  )
}
const DishCol = (props: StackProps) => {
  return <VStack marginRight={5} {...props} />
}

const DishFeedCard = graphql(function DishFeedCard(props: FeedItemDish) {
  const restaurant = useRestaurantQuery(props.restaurant.slug)
  return (
    <CardFrame aspectFixed transparent>
      <VStack position="relative" alignSelf="center">
        <SlantedTitle
          position="absolute"
          top={10}
          left={10}
          alignSelf="flex-start"
          size="sm"
        >
          {restaurant.name}
        </SlantedTitle>
        <DishView showSearchButton size={220} {...props} />
      </VStack>
      <Text fontSize={14} lineHeight={22} opacity={0.4} margin={4}>
        lorem ipsume dolor sit amet lorem ipsume dolor sit amet lorem ipsume
        dolor sit amet lorem ipsume dolor sit amet.
      </Text>
    </CardFrame>
  )
})

const DishRestaurantsFeedCard = (props: FeedItemDishRestaurants) => {
  return (
    <VStack>
      <Link tag={props.dish}>
        <SlantedTitle
          position="absolute"
          fontWeight="800"
          alignSelf="center"
          marginTop={-10}
          size="sm"
        >
          {props.dish.icon ?? null} {props.dish.name}
        </SlantedTitle>
      </Link>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack paddingVertical={5}>
          {props.restaurants.slice(0, 5).map((r, i) => {
            if (!r.slug) {
              return null
            }
            return (
              <VStack
                key={r.id}
                marginRight={-105}
                className="ease-in-out-faster"
                transform={[
                  { scale: 0.7 },
                  { perspective: 1000 },
                  { rotateY: '-10deg' },
                ]}
                borderRadius={cardFrameBorderRadius}
                shadowColor="#000"
                shadowOpacity={0.14}
                shadowRadius={10}
                shadowOffset={{ height: 4, width: 10 }}
                position="relative"
                zIndex={1000 - i}
                hoverStyle={{
                  transform: [
                    { scale: 0.72 },
                    { perspective: 1000 },
                    { rotateY: '-10deg' },
                  ],
                }}
                pressStyle={{
                  transform: [
                    { scale: 0.68 },
                    { perspective: 1000 },
                    { rotateY: '-10deg' },
                  ],
                }}
              >
                <RestaurantCard
                  hideScore
                  restaurantId={r.id}
                  restaurantSlug={r.slug}
                  hoverable={false}
                  below={
                    <VStack position="absolute" bottom={-10} right={-5}>
                      <DishView
                        dish={props.dish}
                        restaurantId={r.id}
                        restaurantSlug={r.slug}
                        size={140}
                      />
                    </VStack>
                  }
                  // below={
                  //   <CommentBubble
                  //     name="Test"
                  //     avatar={peachAvatar}
                  //     text="Lorem ipsum dolor sit amet"
                  //   />
                  // }
                />
              </VStack>
            )
          })}
          <VStack width={100} height={100} />
        </HStack>
      </ScrollView>
    </VStack>
  )
}

const RestaurantFeedCard = (props: FeedItemRestaurant) => {
  return (
    <RestaurantCard
      restaurantId={props.restaurant.id}
      restaurantSlug={props.restaurant.slug}
      below={
        <CommentBubble
          name="Test"
          avatar={peachAvatar}
          text="Lorem ipsum dolor sit amet"
        />
      }
    />
  )
}

const getHomeCuisines = async (center: LngLat) => {
  const cuisineItems = await getHomeDishes(center.lng, center.lat)
  let all: TopCuisine[] = []
  for (const item of cuisineItems) {
    const existing = all.find((x) => x.country === item.country)
    if (existing) {
      const allTopRestaurants = [
        ...existing.top_restaurants,
        ...item.top_restaurants,
      ]
      const sortedTopRestaurants = sortBy(
        allTopRestaurants,
        (x) => -(x.rating ?? 0)
      )
      existing.top_restaurants = uniqBy(
        sortedTopRestaurants,
        (x) => x.id
      ).slice(0, 5)
    } else {
      all.push(item)
    }
  }
  return sortBy(all, (x) => -x.avg_rating)
}

export const HomePageFooter = memo(() => {
  if (!isWeb) {
    return null
  }

  return (
    <Theme name="dark">
      <VStack position="relative">
        <AbsoluteVStack
          zIndex={-1}
          top={-15}
          left={-100}
          right={-100}
          bottom={-55}
          backgroundColor="#000"
          transform={[{ rotate: '-2deg' }]}
        />
        <VStack paddingVertical={20} alignItems="center" paddingHorizontal="5%">
          <VStack>
            <AppIntroLogin />
            <Spacer size="xxl" />
          </VStack>
        </VStack>
      </VStack>
    </Theme>
  )
})
