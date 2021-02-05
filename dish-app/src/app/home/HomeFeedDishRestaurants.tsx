import { graphql, order_by, query } from '@dish/graph'
import { groupBy, sortBy, uniqBy } from 'lodash'
import React from 'react'
import { AbsoluteVStack, HStack, Theme, VStack, useTheme } from 'snackui'

import { selectRishDishViewSimple } from '../../helpers/selectDishViewSimple'
import { queryRestaurant } from '../../queries/queryRestaurant'
import { RegionNormalized } from '../../types/homeTypes'
import { cardFrameBorderRadius } from '../views/CardFrame'
import { TagButton } from '../views/TagButton'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIDishRestaurants = FIBase & {
  type: 'dish-restaurants'
  region: RegionNormalized
  tag: { name: string; icon: string; slug: string }
}

export function useFeedDishItems(
  region?: RegionNormalized | null
): FIDishRestaurants[] {
  if (!region) {
    return []
  }

  const { bbox } = region
  const popularDishTags = query
    .restaurant({
      where: {
        location: {
          _st_within: bbox,
        },
      },
      order_by: [{ upvotes: order_by.desc_nulls_last }],
      limit: 20,
    })
    .flatMap((r) => {
      return r
        .tags({
          limit: 8,
          where: {
            tag: {
              type: {
                _eq: 'dish',
              },
            },
          },
          order_by: [{ upvotes: order_by.desc }],
        })
        .map((x) => ({
          name: x.tag.name ?? '',
          slug: x.tag.slug ?? '',
          icon: x.tag.icon ?? '',
        }))
    })

  const topDishes = sortBy(
    groupBy(popularDishTags, (x) => x.slug),
    (x) => -x.length
  )
    .slice(0, 5)
    .map((x) => x[0])

  return topDishes.map((tag, index) => {
    return {
      id: `dish-restaurant-${tag.name}`,
      region,
      title: `Known for ${tag.name}`,
      type: 'dish-restaurants',
      expandable: true,
      rank: index + (index % 2 ? 10 : 0),
      tag,
    }
  })
}

export const HomeFeedDishRestaurants = graphql(
  ({ tag, region }: FIDishRestaurants) => {
    const restaurants = query.restaurant({
      order_by: [{ upvotes: order_by.desc_nulls_last }],
      limit: 10,
      where: {
        location: {
          _st_within: region.bbox,
        },
        tags: {
          tag: {
            slug: {
              _eq: tag.slug,
            },
          },
        },
      },
    })

    return (
      <>
        <FeedSlantedTitleLink tag={tag}>
          {tag.icon} {tag.name}
        </FeedSlantedTitleLink>
        <SkewedCardCarousel>
          {restaurants.map((r, i) => {
            return (
              <SkewedCard zIndex={1000 - i} key={r.id}>
                <RestaurantCard
                  padTitleSide
                  isBehind={i > 0}
                  hideScore
                  restaurantId={r.id}
                  restaurantSlug={r.slug}
                  hoverable={false}
                  dimImage
                  below={
                    <RestaurantStatBars
                      tags={[tag.slug]}
                      restaurantSlug={r.slug}
                    />
                  }
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </>
    )
  }
)

const RestaurantStatBars = graphql(
  ({
    restaurantSlug,
    tags,
    showTags = 3,
  }: {
    restaurantSlug: string
    tags?: string[]
    showTags?: number
  }) => {
    const [restaurant] = queryRestaurant(restaurantSlug)
    const givenTags =
      tags?.flatMap((tag) => {
        return restaurant.tags({
          where: {
            tag: {
              slug: {
                _eq: tag,
              },
            },
          },
          limit: 1,
        })
      }) ?? []

    const restTags = query.restaurant_tag({
      where: {
        restaurant: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      },
      limit: 3,
      order_by: [{ upvotes: order_by.desc }],
    })

    const rtags = uniqBy([...givenTags, ...restTags], (x) => x.tag.slug).slice(
      0,
      showTags
    )
    const theme = useTheme()

    console.log(
      'rtags',
      rtags.map((x) => [x.score, x.tag.name])
    )

    return (
      <Theme
        name={theme.name === 'dark' ? 'darkTranslucent' : 'lightTranslucent'}
      >
        <AbsoluteVStack
          fullscreen
          top="auto"
          justifyContent="flex-end"
          borderBottomLeftRadius={cardFrameBorderRadius}
          borderBottomRightRadius={cardFrameBorderRadius}
          overflow="hidden"
          padding={10}
        >
          <HStack flexWrap="wrap">
            {rtags.map((rtag) => {
              return (
                <VStack key={rtag.tag.slug} margin={3}>
                  <TagButton {...selectRishDishViewSimple(rtag)} />
                </VStack>
              )
            })}
          </HStack>
          {/* {['Burrito', 'Taco', 'Service'].map((tag, i) => {
            const pct = (i + 20) * (i + 1)
            return (
              <HStack
                key={tag}
                width="100%"
                height={55}
                alignItems="center"
                position="relative"
              >
                <Text
                  fontWeight="300"
                  fontSize={26}
                  textShadowColor="rgba(0,0,0,0.1)"
                  textShadowOffset={{ height: 1, width: 0 }}
                  padding={10}
                  textAlign="right"
                  flex={1}
                  zIndex={2}
                  color="#fff"
                >
                  {tag}
                </Text>
                <AbsoluteVStack
                  backgroundColor="#fff"
                  height={4}
                  bottom={0}
                  left={0}
                  width={`${pct}%`}
                />
                <AbsoluteVStack
                  fullscreen
                  backgroundColor="rgba(255,255,255,0.1)"
                />
              </HStack>
            )
          })} */}
        </AbsoluteVStack>
      </Theme>
    )
  }
)
