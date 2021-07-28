import { graphql, order_by, query } from '@dish/graph'
import { groupBy, pick, sortBy, uniqBy } from 'lodash'
import React, { useMemo } from 'react'
import { LoadingItems, VStack } from 'snackui'

import { isTouchDevice } from '../../constants/platforms'
import { DishTagItemSimple, selectRishDishViewSimple } from '../../helpers/selectDishViewSimple'
import { RegionNormalized } from '../../types/homeTypes'
import { suspense } from '../hoc/suspense'
import { TagButton } from '../views/TagButton'
import { ContentSectionHoverable } from './ContentSectionHoverable'
import { FeedSlantedTitleLink } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { HoverResultsProp } from './HoverResultsProp'
import { CardOverlay } from './restaurant/Card'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SimpleCard, SkewedCardCarousel } from './SimpleCard'

export type FIDishRestaurants = FIBase & {
  type: 'dish-restaurants'
  region: RegionNormalized
  tag: DishTagItemSimple
}

function useFeedDishItems(region?: RegionNormalized | null): FIDishRestaurants[] {
  const bbox = region?.bbox
  const popularDishTags = bbox
    ? query
        .restaurant({
          where: {
            location: {
              _st_within: bbox,
            },
            upvotes: {
              _gt: 15,
            },
          },
          order_by: [{ votes_ratio: order_by.desc }],
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
              order_by: [{ upvotes: order_by.desc }],
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
    return topDishes.map((tag) => {
      return {
        id: `dish-restaurant-${tag.name}`,
        region,
        title: `Known for ${tag.name}`,
        type: 'dish-restaurants',
        tag,
      }
    })
  }, [key])
}

export const HomeFeedDishRestaurants = suspense(
  graphql((props: HoverResultsProp) => {
    const items = useFeedDishItems()
    return (
      <>
        {items.map((item) => {
          return <HomeFeedDishRestaurantsItem key={item.id} {...props} {...item} />
        })}
      </>
    )
  }),
  <VStack height={600} backgroundColor="red">
    <LoadingItems />
  </VStack>
)

const HomeFeedDishRestaurantsItem = graphql(
  ({ tag, region, onHoverResults }: FIDishRestaurants & HoverResultsProp) => {
    const restaurantsQuery = query.restaurant_with_tags({
      args: {
        tag_slugs: tag.slug,
      },
      limit: isTouchDevice ? 6 : 8,
      where: {
        location: {
          _st_within: region.bbox,
        },
      },
    })

    const restaurants = uniqBy(
      restaurantsQuery.map((restaurant) => {
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
      }),
      (x) => x.id
    )

    const contents = useMemo(() => {
      return (
        <>
          <FeedSlantedTitleLink marginTop={-5} tag={tag}>
            {`${tag.icon ? tag.icon + ' ' : ''}${tag.name}`.trim()}
          </FeedSlantedTitleLink>

          <SkewedCardCarousel>
            {restaurants.map((restaurant, i) => {
              return (
                <SimpleCard zIndex={1000 - i} key={restaurant.id || i}>
                  <RestaurantCard
                    padTitleSide
                    hoverToMap
                    // isBehind={i > 0}
                    hideScore
                    restaurantId={restaurant.id}
                    restaurantSlug={restaurant.slug || ''}
                    hoverable={false}
                    dimImage
                    below={(colors) => (
                      <CardOverlay>
                        <TagButton
                          ratingStyle="pie"
                          size="lg"
                          restaurantSlug={restaurant.slug || ''}
                          hideRank
                          color="#fff"
                          backgroundColor="transparent"
                          alignSelf="center"
                          floating
                          {...restaurant.dish}
                        />
                      </CardOverlay>
                    )}
                  />
                </SimpleCard>
              )
            })}
          </SkewedCardCarousel>
        </>
      )
    }, [tag, restaurants.length])

    return (
      <ContentSectionHoverable
        onHoverIn={() => {
          console.log('HOVER')
          onHoverResults(restaurants.map((x) => pick(x, 'id', 'slug') as any))
        }}
      >
        {contents}
      </ContentSectionHoverable>
    )
  },
  {
    // fixes infinite loop bug when switching region
    suspense: false,
  }
)
