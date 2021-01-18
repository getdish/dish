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
import { chunk, partition, sortBy, uniqBy, zip } from 'lodash'
import React, { Suspense, memo, useRef } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  StackProps,
  Text,
  VStack,
  useMedia,
} from 'snackui'

import { peachAvatar } from '../../constants/avatar'
import { RegionNormalized } from '../../helpers/fetchRegion'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { useQueryLoud } from '../../helpers/useQueryLoud'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { HomeStateItemHome } from '../../types/homeTypes'
import { useSetAppMapResults } from '../AppMapStore'
import { CardFrame, cardFrameBorderRadius } from '../views/CardFrame'
import { CommentBubble } from '../views/CommentBubble'
import { DishView } from '../views/dish/DishView'
import { Link } from '../views/Link'
import { ListCard } from '../views/list/ListCard'
import { SlantedTitle } from '../views/SlantedTitle'
import { HomePageFooter, Props } from './HomePage'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { CardCarousel } from './user/CardCarousel'

export type FeedItems =
  | FeedItemDish
  | FeedItemRestaurant
  | FeedItemCuisine
  | FeedItemDishRestaurants

type FeedItemBase = {
  id: string
  title: string
  rank: number
  expandable: boolean
  transparent?: boolean
}
export type FeedItemDish = FeedItemBase & {
  type: 'dish'
  dish: DishTagItem
  restaurant: RestaurantOnlyIds
}
export type FeedItemDishRestaurants = FeedItemBase & {
  type: 'dish-restaurants'
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}
export type FeedItemCuisine = FeedItemBase &
  TopCuisine & {
    type: 'cuisine'
  }
export type FeedItemRestaurant = FeedItemBase & {
  type: 'restaurant'
  restaurant: RestaurantOnlyIds
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
          // ...dishes.map(
          //   (dish, index): FeedItems => {
          //     return {
          //       id: `dish-${dish.id}`,
          //       type: 'dish',
          //       expandable: false,
          //       rank: Math.random() * 10,
          //       transparent: true,
          //       restaurant: {
          //         id: restaurants[0]?.id ?? '',
          //         slug: restaurants[0]?.slug ?? '',
          //       },
          //       dish: {
          //         id: dish.id ?? '',
          //         slug: dish.slug ?? '',
          //         name: dish.name ?? '',
          //         icon: dish.icon ?? '',
          //         image: dish.default_images()?.[0] ?? '',
          //         score: 100,
          //       },
          //     } as const
          //   }
          // ),
          ...dishes.map(
            (dish, index): FeedItems => {
              return {
                id: `dish-restaurant-${dish.id}`,
                title: `Known for ${dish.name}`,
                type: 'dish-restaurants',
                expandable: true,
                rank: index + (index % 2 ? 10 : 0),
                dish: {
                  id: dish.id ?? '',
                  slug: dish.slug ?? '',
                  name: dish.name ?? '',
                  icon: dish.icon ?? '',
                  image: dish.default_images()?.[0] ?? '',
                  score: 100 - index * 10,
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
                title: `${item.country}`,
                type: 'cuisine',
                expandable: true,
                rank: index + (index % 3 ? 30 : 0),
                ...item,
              } as const
            }
          ),
          // ...restaurants.map(
          //   (item, index): FeedItems => {
          //     return {
          //       id: `restaurant-${item.id}`,
          //       title: item.name,
          //       expandable: false,
          //       type: 'restaurant',
          //       rank: index,
          //       restaurant: {
          //         id: item.id,
          //         slug: item.slug,
          //       },
          //     } as const
          //   }
          // ),
        ]

  items = items.filter((x) => x.id)
  items = sortBy(items, (x) => x.rank)
  items = uniqBy(items, (x) => x.id)

  return items
}

export const HomePageFeed = memo(
  graphql(function HomePageFeed({
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
    const recentLists = query.list({
      limit: 10,
      where: {
        public: {
          _neq: false,
        },
      },
      order_by: [{ created_at: order_by.asc }],
    })
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
              <SlantedTitle size="sm">Lists</SlantedTitle>
              <CardCarousel>
                {recentLists.map((list) => {
                  if (!list) {
                    return null
                  }
                  return (
                    <ListCard
                      key={list.slug}
                      slug={list.slug}
                      userSlug={list.user.username}
                    />
                  )
                })}
              </CardCarousel>

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
                      <SlantedTitle size="sm">{item.title}</SlantedTitle>
                      {content}
                    </VStack>
                  )
                })}
              </HStack>
            </VStack>

            <VStack height={20} />

            <HomePageFooter />
          </Suspense>
        )}
      </>
    )
  })
)
const isRestaurantFeedItem = (x: FeedItems): x is FeedItemRestaurant =>
  x.type === 'restaurant'
const useTopCuisines = (center: LngLat) => {
  return useQueryLoud('topcuisine', () => getHomeCuisines(center))
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
      <AbsoluteVStack zIndex={10} top={-5} left={-5} right={-5}>
        <SlantedTitle alignSelf="center">
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
  const [restaurant] = queryRestaurant(props.restaurant.slug)
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
                        isFallback
                      />
                    </VStack>
                  }
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
      aspectFixed={false}
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
