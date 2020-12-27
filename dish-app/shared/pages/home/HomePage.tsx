import { fullyIdle, series } from '@dish/async'
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
import { isPresent } from '@dish/helpers/src'
import { capitalize, chunk, partition, sortBy, uniqBy, zip } from 'lodash'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import { useQuery } from 'react-query'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Spacer,
  StackProps,
  Text,
  VStack,
  useMedia,
  useTheme,
} from 'snackui'

import {
  drawerWidthMax,
  searchBarHeight,
  searchBarHeightWithPadding,
} from '../../constants'
import { DishHorizonView } from '../../DishHorizonView'
import { RegionNormalized, useRegionQuery } from '../../helpers/fetchRegion'
import { getGroupedButtonProps } from '../../helpers/getGroupedButtonProps'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemHome } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { router } from '../../state/router'
import { useOvermind } from '../../state/useOvermind'
import { CardFrame, useCardFrame } from '../../views/CardFrame'
import { CommentBubble } from '../../views/CommentBubble'
import { ContentScrollView } from '../../views/ContentScrollView'
import { DishView } from '../../views/dish/DishView'
import { PageFooter } from '../../views/layout/PageFooter'
import { LinkButton } from '../../views/ui/LinkButton'
import { LinkButtonProps } from '../../views/ui/LinkProps'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { RestaurantButton } from '../restaurant/RestaurantButton'
import { RestaurantCard } from '../restaurant/RestaurantCard'
import { peachAvatar } from '../search/avatar'
import { StackViewProps } from '../StackViewProps'
import { HomeTopSearches } from './HomeTopSearches'

type Props = StackViewProps<HomeStateItemHome>

type FeedItemBase = {
  id: string
  rank: number
  expandable: boolean
  transparent?: boolean
}

type FeedItemDish = FeedItemBase & {
  type: 'dish'
  dish: DishTagItem
  restaurant: RestaurantOnlyIds
}

type FeedItemDishRestaurants = FeedItemBase & {
  type: 'dish-restaurants'
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}

type FeedItemCuisine = FeedItemBase &
  TopCuisine & {
    type: 'cuisine'
  }

type FeedItemRestaurant = FeedItemBase & {
  type: 'restaurant'
  restaurant: RestaurantOnlyIds
}

type FeedItems =
  | FeedItemDish
  | FeedItemRestaurant
  | FeedItemCuisine
  | FeedItemDishRestaurants

export default memo(function HomePage(props: Props) {
  const om = useOvermind()
  const theme = useTheme()
  const [isLoaded, setIsLoaded] = useState(false)
  const region = useRegionQuery(props.item.region, {
    enabled: !!props.item.region,
  })

  // load effect!
  usePageLoadEffect(props, () => {
    // default navigate to a region (TODO make it the nearest one to current map..)
    if (!props.item.region) {
      router.navigate({
        name: 'homeRegion',
        params: {
          region: 'ca-san-francisco',
        },
      })
    }

    if (props.isActive) {
      setIsLoaded(true)
    } else {
      series([
        fullyIdle,
        () => {
          setIsLoaded(true)
        },
      ])
    }
  })

  // center map to region
  useEffect(() => {
    if (!region.data) return
    const { center, span } = region.data
    console.log('we got a region', center, span)
    if (!center || !span) return
    om.actions.home.updateCurrentState({
      center,
      span,
    })
  }, [region.data])

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (props.isActive && isLoaded) {
      om.actions.home.clearSearch()
      om.actions.home.clearTags()
    }
  }, [props.isActive])

  const regionName = (() => {
    let next =
      (region.data?.name ?? '')
        .toLowerCase()
        .replace('ca- ', '')
        .split(' ')
        .map((x) => capitalize(x))
        .join(' ') ?? ''
    if (next === '') return '...'
    return next
  })()

  const navLinks: LinkButtonProps[] = [
    {
      name: 'homeRegion',
      params: { region: props.item.region, section: '' },
      children: 'Hot',
    },
    {
      name: 'homeRegion',
      params: { region: props.item.region, section: 'new' },
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
                  <HStack paddingVertical={10} paddingHorizontal={10}>
                    <SlantedTitle
                      position="relative"
                      overflow="visible"
                      minWidth={80}
                      size="xl"
                    >
                      {regionName}

                      <HStack position="absolute" bottom="-90%" right="2%">
                        {navLinks.map((linkProps, index) => {
                          return (
                            <LinkButton
                              key={index}
                              backgroundColor="#fff"
                              shadowColor="#000"
                              shadowOpacity={0.1}
                              shadowRadius={3}
                              paddingHorizontal={8}
                              fontSize={14}
                              color={
                                props.item.section === linkProps.params.section
                                  ? 'red'
                                  : '#888'
                              }
                              {...getGroupedButtonProps({
                                index,
                                items: navLinks,
                              })}
                              {...linkProps}
                            />
                          )
                        })}
                      </HStack>
                    </SlantedTitle>
                    <HomeTopSearches />
                  </HStack>
                </ScrollView>
              </HStack>

              <Spacer size="md" />

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

// TODO tricky snackui extraction
const HomeTopSpacer = () => {
  const media = useMedia()
  return (
    <VStack
      pointerEvents="none"
      height={5 + (media.sm ? 0 : searchBarHeight)}
    />
  )
}

const isRestaurantFeedItem = (x: FeedItems): x is FeedItemRestaurant =>
  x.type === 'restaurant'

const HomePageContent = memo(
  graphql(function HomePageContent({
    region,
    item,
  }: {
    region?: RegionNormalized
    item: HomeStateItemHome
  }) {
    const media = useMedia()
    const isNew = item.section === 'new'
    const items = useHomeFeed(item, region, isNew)
    const results = items.filter(isRestaurantFeedItem)
    const isLoading = !region || items[0]?.id === null

    useEffect(() => {
      if (isLoading) return
      const next: HomeStateItemHome = {
        ...item,
        results: results.map((x) => x.restaurant),
      }
      omStatic.actions.home.updateHomeState(next)
    }, [isLoading, JSON.stringify(results)])

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
                      paddingHorizontal={8}
                      paddingBottom="6%"
                      // flex={1}
                      alignItems="center"
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

            <PageFooter />
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
  const backupRestaurants = region?.bbox
    ? query.restaurant({
        where: {
          location: {
            _st_within: region?.bbox,
          },
          downvotes: { _is_null: false },
          votes_ratio: { _is_null: false },
        },
        order_by: [{ votes_ratio: order_by.desc }],
        limit: 10,
      })
    : []

  const restaurants = uniqBy(
    [...feedRestaurants, ...backupRestaurants],
    (x) => x.id
  )
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
      })
    : []

  const restaurants = props.dishes?.[0]?.best_restaurants ?? []
  const perCol = 2

  return (
    <VStack height="100%" maxWidth="100%">
      <AbsoluteVStack zIndex={10} top={-5} left={-5}>
        <SlantedTitle
          color="#fff"
          fontWeight="600"
          lineHeight={20}
          fontSize={20}
          backgroundColor="#000"
        >
          {props.country} {props.icon}
        </SlantedTitle>
      </AbsoluteVStack>
      <ScrollView
        ref={scrollRef}
        style={{ maxWidth: '100%', overflow: 'hidden' }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <VStack paddingTop={48} paddingLeft={15}>
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

      <AbsoluteVStack bottom={0} left={0} backgroundColor="#fff">
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
      </AbsoluteVStack>
    </VStack>
  )
})

const getRestaurantButton = (r, i) => {
  if (!r.slug) {
    return null
  }
  return (
    <RestaurantButton
      subtle
      key={r.id}
      trending="up"
      // rank={0}
      restaurantSlug={r.slug}
    />
  )
}

const getDishColInner = (dish: tag, i: number) => {
  return (
    <VStack marginBottom={5} key={i}>
      <DishView size={100} dish={selectTagDishViewSimple(dish)} />
    </VStack>
  )
}
const DishCol = (props: StackProps) => {
  return <VStack marginRight={5} {...props} />
}

const DishFeedCard = graphql(function DishFeedCard(props: FeedItemDish) {
  const restaurant = useRestaurantQuery(props.restaurant.slug)
  return (
    <CardFrame expandable transparent>
      <VStack position="relative" alignSelf="center">
        <SlantedTitle
          position="absolute"
          top={10}
          left={10}
          alignSelf="flex-start"
          size="xl"
        >
          {restaurant.name}
        </SlantedTitle>
        <DishView showSearchButton size="100%" {...props} />
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
      <SlantedTitle
        position="absolute"
        fontWeight="800"
        alignSelf="center"
        marginTop={-10}
        size="xs"
      >
        {props.dish.icon ?? null} {props.dish.name}
      </SlantedTitle>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack paddingVertical={5} paddingHorizontal={20}>
          {props.restaurants.map((r) => {
            if (!r.slug) {
              return null
            }
            return (
              <HStack key={r.id}>
                <VStack marginHorizontal={-15} transform={[{ scale: 0.8 }]}>
                  <RestaurantCard
                    restaurantId={r.id}
                    restaurantSlug={r.slug}
                    below={
                      <CommentBubble
                        name="Test"
                        avatar={peachAvatar}
                        text="Lorem ipsum dolor sit amet"
                      />
                    }
                  />
                </VStack>
              </HStack>
            )
          })}
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
