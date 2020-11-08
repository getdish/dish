import {
  LngLat,
  RestaurantOnlyIds,
  TopCuisine,
  getHomeDishes,
  graphql,
  order_by,
  query,
} from '@dish/graph'
import { fullyIdle, series } from '@o/async'
import { random, sortBy, uniqBy } from 'lodash'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  LoadingItem,
  LoadingItems,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { bgLightHover } from '../../colors'
import { drawerWidthMax, searchBarHeight } from '../../constants'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { useAsyncEffect } from '../../hooks/useAsync'
import { useIsNarrow } from '../../hooks/useIs'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { HomeStateItemHome } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { ContentScrollView } from '../../views/ContentScrollView'
import { DishView, DishViewProps } from '../../views/dish/DishView'
import { PageFooter } from '../../views/layout/PageFooter'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SlantedBox } from '../../views/ui/SlantedBox'
import { CardFrame } from '../restaurant/CardFrame'
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
          shadowColor="#000"
          shadowOpacity={0.05}
          shadowRadius={7}
          height={searchBarHeight + 10}
        />
      </AbsoluteVStack>

      <VStack
        flex={1}
        width="100%"
        maxWidth={drawerWidthMax}
        alignSelf="flex-end"
      >
        <ContentScrollView id="home">
          {/* cross line */}
          <AbsoluteVStack
            opacity={isSmall ? 0 : 1}
            contain="strict"
            height={320}
            width={2000}
            right="-10%"
            zIndex={-1}
            top={-120}
            transform={[{ rotate: '-2deg' }]}
            overflow="hidden" // fixes chrome rendering line at bottom glitch
          >
            <LinearGradient
              style={[StyleSheet.absoluteFill]}
              colors={[bgLightHover, '#fff']}
            />
          </AbsoluteVStack>
          <VStack flex={1} overflow="hidden" maxWidth="100%">
            <VStack>
              <VStack
                pointerEvents="none"
                height={20 + (isSmall ? 0 : searchBarHeight + 10)}
              />

              <VStack alignItems="center">
                <SlantedBox>
                  <Text
                    paddingHorizontal={6}
                    fontSize={22}
                    color="#000"
                    fontWeight="600"
                  >
                    San Francisco
                  </Text>
                </SlantedBox>
              </VStack>

              <HomeTopSearches />

              <Spacer size="sm" />

              <Suspense fallback={null}>
                <VStack minHeight={Dimensions.get('window').height * 0.9}>
                  <HomeFeed {...props} />
                </VStack>

                {/* pad bottom */}
                <VStack height={20} />

                <PageFooter />
              </Suspense>
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
  dish: DishTagItem
  restaurants: RestaurantOnlyIds[]
}

type FeedItems =
  | {
      type: 'restaurant'
      id: string
      restaurantSlug: string
      restaurantId: string
    }
  | ({ type: 'cuisine'; id: string } & TopCuisine)
  | FeedItemDish

const HomeFeed = memo(
  graphql((props: Props) => {
    const restaurants = query.restaurant({
      where: {
        location: {
          _st_within: props.item.region.geometry,
        },
      },
      order_by: [{ score: order_by.desc }],
      limit: 8,
    })

    const cuisines = useTopCuisines(props.item.center) ?? []
    console.log('cuisines', cuisines)

    const dishes = query.tag({
      where: {
        type: {
          _eq: 'dish',
        },
      },
      order_by: [{ popularity: order_by.desc }],
      limit: 8,
    })

    if (!props.item.region) {
      return (
        <>
          <LoadingItems />
          <LoadingItems />
        </>
      )
    }

    const items: FeedItems[] = sortBy(
      [
        ...dishes.map((item, index) => {
          return {
            type: 'dish',
            id: item.id,
            rank: index + (index % 2 ? 10 : 0),
            dish: {
              slug: item.slug ?? '',
              name: item.name ?? '',
              icon: item.icon ?? '',
              image: item.default_images()?.[0] ?? '',
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
      ].filter((x) => x.id),
      (x) => (x.rank < 3 ? random() : x.rank)
    )

    console.log('items', items)

    return (
      <HStack paddingHorizontal={10} justifyContent="center" flexWrap="wrap">
        {items.map((item) => {
          const content = (() => {
            switch (item.type) {
              case 'restaurant':
                return <RestaurantCard {...item} />
              case 'dish':
                return <DishFeedCard {...item} />
            }
          })()
          if (!content) {
            return null
          }
          return (
            <VStack key={item.id} margin={10}>
              {content}
            </VStack>
          )
        })}
      </HStack>
    )
  })
)

const DishFeedCard = (props: FeedItemDish) => {
  return (
    <CardFrame>
      <DishView size={180} {...props} />
      {props.restaurants.map((r) => {
        return (
          <RestaurantButton
            subtle
            key={r.id}
            trending="up"
            rank={0}
            restaurantSlug={r.slug}
          />
        )
      })}
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
