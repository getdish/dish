import { graphql, order_by, query } from '@dish/graph'
import { groupBy, pick, sortBy, uniqBy } from 'lodash'
import React, { useMemo } from 'react'
import { HStack, Hoverable, Theme } from 'snackui'

import {
  DishTagItemSimple,
  selectRishDishViewSimple,
} from '../../helpers/selectDishViewSimple'
import { RegionNormalized } from '../../types/homeTypes'
import { TagButtonSlanted } from '../views/dish/TagButtonSlanted'
import { TagButton } from '../views/TagButton'
import { ContentSectionHoverable } from './ContentSectionHoverable'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { CardOverlay } from './restaurant/Card'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FIDishRestaurants = FIBase & {
  type: 'dish-restaurants'
  region: RegionNormalized
  tag: DishTagItemSimple
}

export function useFeedDishItems(
  region?: RegionNormalized | null
): FIDishRestaurants[] {
  const bbox = region?.bbox
  const popularDishTags = bbox
    ? query
        .restaurant({
          where: {
            location: {
              _st_within: bbox,
            },
          },
          order_by: [{ upvotes: order_by.desc_nulls_last }],
          limit: 12,
        })
        .flatMap((r) => {
          return r
            .tags({
              limit: 6,
              where: {
                tag: {
                  type: {
                    _eq: 'dish',
                  },
                },
              },
              order_by: [{ upvotes: order_by.desc_nulls_last }],
            })
            .map(selectRishDishViewSimple)
        })
    : []

  const key = `${popularDishTags.map((x) => x.id)}`

  return useMemo(() => {
    if (!region) {
      return []
    }
    const grouped = groupBy(popularDishTags, (x) => x.slug)
    const sorted = sortBy(grouped, (x) => -x.length)
    const topDishes = sorted.slice(0, 5).map((x) => x[0])
    return topDishes.map((tag, index) => {
      return {
        id: `dish-restaurant-${tag.name}`,
        region,
        title: `Known for ${tag.name}`,
        type: 'dish-restaurants',
        expandable: true,
        tag,
      }
    })
  }, [key])
}

export const HomeFeedDishRestaurants = graphql(
  ({ tag, region, onHoverResults }: FIDishRestaurants & HoverResultsProp) => {
    const restaurantsQuery = query.restaurant_with_tags({
      args: {
        tag_slugs: tag.slug,
      },
      limit: 8,
      where: {
        location: {
          _st_within: region.bbox,
        },
      },
    })

    const restaurants = restaurantsQuery.map((restaurant) => {
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

      return {
        id: restaurant.id,
        slug: restaurant.slug,
        dish: selectRishDishViewSimple(rtag),
      }
    })

    const contents = useMemo(() => {
      return (
        <>
          <FeedSlantedTitleLink tag={tag}>
            {tag.icon} {tag.name}
          </FeedSlantedTitleLink>

          <SkewedCardCarousel>
            {restaurants.map((restaurant, i) => {
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
                        <TagButton
                          size="lg"
                          restaurantSlug={restaurant.slug || ''}
                          color="#fff"
                          backgroundColor="transparent"
                          floating
                          {...restaurant.dish}
                        />
                      </CardOverlay>
                    )}
                  />
                </SkewedCard>
              )
            })}
          </SkewedCardCarousel>
        </>
      )
    }, [tag, restaurants.length])

    return (
      <ContentSectionHoverable
        onHoverIn={() => {
          onHoverResults(restaurants.map((x) => pick(x, 'id', 'slug') as any))
        }}
      >
        {contents}
      </ContentSectionHoverable>
    )
  }
)
