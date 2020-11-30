import {
  LngLat,
  RestaurantOnlyIds,
  Tag,
  TopCuisine,
  TopCuisineDish,
  getHomeDishes,
  graphql,
  order_by,
  query,
  tag,
} from '@dish/graph'
import { getStore } from '@dish/use-store'
import { fullyIdle, series } from '@o/async'
import { sortBy, uniqBy } from 'lodash'
import React, { Suspense, memo, useEffect, useRef, useState } from 'react'
import { Dimensions, ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItems,
  Spacer,
  StackProps,
  Text,
  VStack,
} from 'snackui'

import { AppMapStore } from '../../AppMapStore'
import { drawerWidthMax, searchBarHeight } from '../../constants'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { selectTagDishViewSimple } from '../../helpers/selectDishViewSimple'
import { useAsyncEffect } from '../../hooks/useAsync'
import { useIsNarrow } from '../../hooks/useIs'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemHome, Region } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { useOvermind } from '../../state/useOvermind'
import { ContentScrollView } from '../../views/ContentScrollView'
import { DishView } from '../../views/dish/DishView'
import { PageFooter } from '../../views/layout/PageFooter'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SlantedBox } from '../../views/ui/SlantedBox'
import {
  CardFrame,
  cardFrameHeight,
  cardFrameWidth,
} from '../restaurant/CardFrame'
import { RestaurantButton } from '../restaurant/RestaurantButton'
import { RestaurantCard } from '../restaurant/RestaurantCard'
import { StackViewProps } from '../StackViewProps'
import { HomeTopSearches } from './HomeTopSearches'

// top dishes

type Props = StackViewProps<HomeStateItemHome>

export default memo(function HomePage(props: Props) {
  const om = useOvermind()
  const [isLoaded, setIsLoaded] = useState(false)
  const isSmall = useIsNarrow()

  // on load home clear search effect!
  useEffect(() => {
    // not on first load
    if (props.isActive && isLoaded) {
      om.actions.home.clearSearch()
      om.actions.home.clearTags()
    }
  }, [props.isActive])

  // load effect!
  usePageLoadEffect(props, () => {
    if (props.isActive) {
      setIsLoaded(true)
    } else {
      return series([
        fullyIdle,
        () => {
          setIsLoaded(true)
        },
      ])
    }
  })

  useEffect(() => {
    console.log('got region', props.item.region)
  }, [props.item.region])

  const topContentHeight = 20 + (isSmall ? 0 : searchBarHeight + 10)
  const region =
    getStore(AppMapStore).regions[props.item.region] ??
    getStore(AppMapStore).regions['san-francisco']

  return (
    <>
      <PageTitleTag>Dish - Uniquely Good Food</PageTitleTag>
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
          shadowColor="#fff"
          shadowOpacity={1}
          borderBottomColor="#f8f8f8"
          borderBottomWidth={1}
          shadowRadius={10}
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
          <VStack flex={1} overflow="hidden" maxWidth="100%">
            <VStack>
              <VStack pointerEvents="none" height={topContentHeight} />
              {!!region && <HomeFeed region={region} item={props.item} />}
            </VStack>
          </VStack>
        </ContentScrollView>
      </VStack>
    </>
  )
})

type FeedItemDish = {
  type: 'dish'
  id: string
  rank: number
  dish: DishTagItem
  restaurantId: string
  restaurantSlug: string
}

type FeedItemDishRestaurants = {
  type: 'dish-restaurants'
  id: string
  rank: number
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}

type FeedItemCuisine = TopCuisine & {
  type: 'cuisine'
  id: string
  rank: number
}

type FeedItems =
  | FeedItemDish
  | {
      type: 'restaurant'
      id: string
      restaurantSlug: string
      restaurantId: string
      rank: number
    }
  | FeedItemCuisine
  | FeedItemDishRestaurants

const HomeFeed = memo(
  graphql(function HomeFeed({
    region,
    item,
  }: {
    region: Region
    item: HomeStateItemHome
  }) {
    const restaurants = region?.geometry
      ? query.restaurant({
          where: {
            location: {
              _st_within: region?.geometry,
            },
            downvotes: { _is_null: false },
            votes_ratio: { _is_null: false },
          },
          order_by: [{ votes_ratio: order_by.desc }],
          limit: 8,
        })
      : []

    const cuisines = useTopCuisines(item.center) ?? []

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
            ...dishes.map((dish, index) => {
              return {
                type: 'dish',
                id: dish.id,
                rank: Math.random() * 10,
                restaurantId: restaurants[0]?.id ?? '',
                restaurantSlug: restaurants[0]?.slug ?? '',
                dish: {
                  slug: dish.slug ?? '',
                  name: dish.name ?? '',
                  icon: dish.icon ?? '',
                  image: dish.default_images()?.[0] ?? '',
                  score: 100,
                },
              } as const
            }),
            ...dishes.map((dish, index) => {
              return {
                type: 'dish-restaurants',
                id: dish.id,
                rank: index + (index % 2 ? 10 : 0),
                dish: {
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
            }),
            ...cuisines.map((item, index) => {
              return {
                type: 'cuisine',
                id: item.country,
                rank: index + (index % 3 ? 30 : 0),
                ...item,
              } as const
            }),
            ...restaurants.map((item, index) => {
              return {
                id: item.id,
                type: 'restaurant',
                restaurantId: item.id,
                restaurantSlug: item.slug,
                rank: index,
              } as const
            }),
          ]

    items = items.filter((x) => x.id)
    items = sortBy(items, (x) => x.rank)
    items = uniqBy(items, (x) => x.id)

    const results = items
      .filter((x) => x.type === 'restaurant')
      .map((x) => ({ id: x['restaurantId'], slug: x['restaurantSlug'] }))

    const isLoading = !region || items[0]?.id === null

    useEffect(() => {
      if (isLoading) return
      console.log('set results', results)
      omStatic.actions.home.updateHomeState({
        id: item.id,
        results,
      })
    }, [JSON.stringify(results)])

    if (isLoading) {
      return (
        <>
          <LoadingItems />
          <LoadingItems />
        </>
      )
    }

    return (
      <>
        <VStack alignItems="center">
          <Text
            paddingHorizontal={6}
            fontSize={28}
            color="#000"
            fontWeight="800"
          >
            {region.name ?? '...'}
          </Text>
        </VStack>

        <HomeTopSearches />

        <Suspense fallback={null}>
          <VStack
            paddingBottom={100}
            minHeight={Dimensions.get('window').height * 0.9}
          >
            <HStack justifyContent="center" flexWrap="wrap">
              {items.slice(0, 12).map((item) => {
                const content = (() => {
                  switch (item.type) {
                    case 'restaurant':
                      return <RestaurantCard {...item} />
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
                    paddingHorizontal={15}
                    paddingBottom={25}
                    paddingTop={5}
                    // flex={1}
                    alignItems="center"
                  >
                    {content}
                  </VStack>
                )
              })}
            </HStack>
          </VStack>

          {/* pad bottom */}
          <VStack height={20} />

          <PageFooter />
        </Suspense>
      </>
    )
  })
)

const CuisineFeedCard = graphql(function CuisineFeedCard(
  props: FeedItemCuisine
) {
  const [restaurants, setRestaurants] = useState<
    TopCuisineDish['best_restaurants']
  >([])
  const scrollRef = useRef<ScrollView>()
  const dishes = query.tag({
    where: {
      name: {
        _in: props.dishes.map((x) => x.name),
      },
    },
  })

  const r = props.dishes[0]?.best_restaurants
  useEffect(() => {
    setRestaurants(r)
  }, [r])

  // useLayoutEffect(() => {
  //   const scroll = scrollRef.current
  //   if (!scroll) return
  //   scroll.scrollTo({ x: 15 })
  // }, [])

  const perCol = 2

  return (
    <CardFrame>
      <VStack height="100%" maxWidth="100%">
        <AbsoluteVStack zIndex={10} top={-5} left={-5}>
          <SlantedBox backgroundColor="#000">
            <Text color="#fff" fontWeight="600" lineHeight={20} fontSize={20}>
              {props.country} {props.icon}
            </Text>
          </SlantedBox>
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
    </CardFrame>
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
  const restaurant = useRestaurantQuery(props.restaurantSlug)
  return (
    <CardFrame>
      <VStack
        height={cardFrameHeight}
        borderRadius={20}
        alignItems="center"
        justifyContent="space-between"
        overflow="hidden"
        flexWrap="nowrap"
      >
        <Text
          alignSelf="flex-start"
          selectable
          lineHeight={28}
          maxHeight={28}
          fontSize={18}
          fontWeight="400"
          color="#fff"
          padding={10}
          backgroundColor="rgba(0,0,0,0.85)"
          shadowColor="#000"
          shadowOpacity={0.2}
          shadowRadius={5}
          shadowOffset={{ height: 3, width: 0 }}
          borderRadius={7}
        >
          {restaurant.name}
        </Text>
        <DishView showSearchButton size={cardFrameWidth - 10} {...props} />
        <Text fontSize={14} lineHeight={22} opacity={0.4} margin={4}>
          lorem ipsume dolor sit amet lorem ipsume dolor sit amet lorem ipsume
          dolor sit amet lorem ipsume dolor sit amet.
        </Text>
      </VStack>
    </CardFrame>
  )
})

const DishRestaurantsFeedCard = (props: FeedItemDishRestaurants) => {
  return (
    <CardFrame>
      <AbsoluteVStack
        zIndex={10}
        top={0}
        right={0}
        transform={[{ translateX: 10 }, { translateY: -10 }]}
      >
        <DishView size={160} {...props} />
      </AbsoluteVStack>
      <VStack
        flexWrap="nowrap"
        flex={1}
        paddingTop={180}
        borderRadius={20}
        overflow="hidden"
      >
        {props.restaurants.map((r) => {
          if (!r.slug) {
            return null
          }
          return (
            <RestaurantButton
              maxInnerWidth={220}
              subtle
              key={r.id}
              trending="up"
              restaurantSlug={r.slug}
            />
          )
        })}
      </VStack>
    </CardFrame>
  )
}

const useTopCuisines = (center: LngLat) => {
  const [state, setState] = useState<TopCuisine[]>()

  useAsyncEffect(async (ok) => {
    let res = await getHomeCuisines(center)
    ok()
    setState(res)
  }, [])

  return state
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
