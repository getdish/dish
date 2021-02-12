import { graphql, order_by, query } from '@dish/graph'
import { groupBy, pick, sortBy, uniqBy } from 'lodash'
import React from 'react'
import { AbsoluteVStack, HStack, Hoverable, Spacer, VStack } from 'snackui'

import {
  DishTagItemSimple,
  selectRishDishViewSimple,
  selectTagDishViewSimple,
} from '../../helpers/selectDishViewSimple'
import { queryTag } from '../../queries/queryTag'
import { RegionNormalized } from '../../types/homeTypes'
import { cardFrameBorderRadius } from '../views/CardFrame'
import { DishView } from '../views/dish/DishView'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { CardOverlay } from './restaurant/Card'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantStatBars } from './RestaurantStatBars'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIDishRestaurants = FIBase & {
  type: 'dish-restaurants'
  region: RegionNormalized
  tag: DishTagItemSimple
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
      order_by: [{ upvotes: order_by.asc }],
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
          order_by: [{ upvotes: order_by.asc }],
        })
        .map(selectRishDishViewSimple)
    })

  const topDishes = sortBy(
    groupBy(
      uniqBy(popularDishTags, (x) => x.slug),
      (x) => x.slug
    ),
    (x) => -x.length
  )
    .slice(0, 5)
    .map((x) => x[0])

  console.log('waht', { popularDishTags, topDishes })

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
  ({ tag, region, onHoverResults }: FIDishRestaurants & HoverResultsProp) => {
    const restaurants = query.restaurant_with_tags({
      args: {
        tag_slugs: tag.slug,
      },
      limit: 10,
      where: {
        location: {
          _st_within: region.bbox,
        },
      },
    })

    return (
      <Hoverable
        onHoverIn={() => {
          onHoverResults(restaurants.map((x) => pick(x, 'id', 'slug') as any))
        }}
      >
        <FeedSlantedTitleLink tag={tag}>
          {tag.icon} {tag.name}
        </FeedSlantedTitleLink>

        <SkewedCardCarousel>
          {restaurants.map((restaurant, i) => {
            const rtag = restaurant.tags({
              where: {
                tag: {
                  slug: {
                    _eq: tag.slug,
                  },
                },
              },
              limit: 1,
            })[0]
            const dishViewProps = selectRishDishViewSimple(rtag)

            console.log('rtag', dishViewProps)

            return (
              <SkewedCard zIndex={1000 - i} key={restaurant.id}>
                <RestaurantCard
                  padTitleSide
                  hoverToMap
                  isBehind={i > 0}
                  hideScore
                  restaurantId={restaurant.id}
                  restaurantSlug={restaurant.slug || ''}
                  hoverable={false}
                  dimImage
                  below={(colors) => (
                    <CardOverlay>
                      <HStack
                        alignItems="center"
                        justifyContent="center"
                        paddingBottom={20}
                      >
                        <DishView
                          restaurantSlug={restaurant.slug || ''}
                          restaurantId={restaurant.id || ''}
                          {...dishViewProps}
                          size={180}
                        />
                      </HStack>
                      {/* <Spacer /> */}
                      {/* <RestaurantStatBars
                        restaurantSlug={r.slug || ''}
                        colors={colors}
                      /> */}
                    </CardOverlay>
                  )}
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </Hoverable>
    )
  }
)
