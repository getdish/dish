import { graphql, order_by, query } from '@dish/graph'
import { groupBy, pick, sortBy, uniqBy } from 'lodash'
import React from 'react'
import { Hoverable, VStack } from 'snackui'

import { selectRishDishViewSimple } from '../../helpers/selectDishViewSimple'
import { RegionNormalized } from '../../types/homeTypes'
import { TagButton } from '../views/TagButton'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { RestaurantStatBars } from './RestaurantStatBars'
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
          order_by: [{ upvotes: order_by.desc_nulls_last }],
        })
        .map((x) => ({
          name: x.tag.name ?? '',
          slug: x.tag.slug ?? '',
          icon: x.tag.icon ?? '',
        }))
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
          {restaurants.map((r, i) => {
            return (
              <SkewedCard zIndex={1000 - i} key={r.id}>
                <RestaurantCard
                  padTitleSide
                  hoverToMap
                  isBehind={i > 0}
                  hideScore
                  restaurantId={r.id}
                  restaurantSlug={r.slug || ''}
                  hoverable={false}
                  dimImage
                  below={(colors) => (
                    <RestaurantStatBars
                      tags={[tag.slug]}
                      restaurantSlug={r.slug || ''}
                      colors={colors}
                    />
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
