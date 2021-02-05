import { RestaurantOnlyIds, graphql } from '@dish/graph'
import React, { memo } from 'react'

import { FeedSlantedTitle } from './FeedSlantedTitle'
import { FIBase } from './FIBase'
import { RestaurantCard } from './restaurant/RestaurantCard'
import { SkewedCard, SkewedCardCarousel } from './SkewedCard'

export type FINew = FIBase & {
  type: 'new'
  restaurants: RestaurantOnlyIds[]
}

export type FIHot = FIBase & {
  type: 'hot'
  restaurants: RestaurantOnlyIds[]
}

export const HomeFeedTrendingNew = memo(
  graphql(function HomeFeedTrendingNew(props: FIHot | FINew) {
    const restaurants = props.restaurants
    if (!restaurants) {
      return null
    }
    return (
      <>
        <FeedSlantedTitle zIndex={10}>{props.title}</FeedSlantedTitle>
        <SkewedCardCarousel>
          {restaurants.map((r, i) => {
            if (!r) {
              return null
            }
            return (
              <SkewedCard zIndex={1000 - i} key={r.id}>
                <RestaurantCard
                  size="sm"
                  aspectFixed
                  padTitleSide
                  isBehind={i > 0}
                  hideScore
                  restaurantId={r.id}
                  restaurantSlug={r.slug}
                  hoverable={false}
                />
              </SkewedCard>
            )
          })}
        </SkewedCardCarousel>
      </>
    )
  })
)
