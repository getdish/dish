import { graphql, order_by } from '@dish/graph'
import React, { Suspense, memo, useCallback, useState } from 'react'
import { AbsoluteVStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { CardFrame } from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Card } from './Card'
import { priceRange } from './RestaurantDetailRow'

export type RestaurantCardProps = {
  // size?: 'lg' | 'md' | 'sm'
  restaurantSlug: string
  restaurantId: string
  below?: any
  hideScore?: boolean
  hoverable?: boolean
  aspectFixed?: boolean
}

const fallbackCard = <CardFrame aspectFixed />

export const RestaurantCard = (props: RestaurantCardProps) => {
  if (!props.restaurantSlug) {
    return fallbackCard
  }
  return (
    <Suspense fallback={fallbackCard}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )
}

export const RestaurantCardContent = memo(
  graphql(
    ({
      // size = 'lg',
      restaurantSlug,
      restaurantId,
      hideScore,
      aspectFixed,
      hoverable = true,
      below,
    }: RestaurantCardProps) => {
      const restaurant = queryRestaurant(restaurantSlug)
      const [price_label, price_color, price_range] = priceRange(restaurant)
      const restaurantPhoto = restaurant.photo_table({
        order_by: [{ photo: { quality: order_by.desc } }],
        limit: 1,
      })?.[0]?.photo.url

      return (
        <Link name="restaurant" asyncClick params={{ slug: restaurantSlug }}>
          <Card
            title={restaurant.name}
            subTitle={price_range}
            below={below}
            outside={
              !hideScore && (
                <AbsoluteVStack top={-10} left={-10} zIndex={20}>
                  <RestaurantUpVoteDownVote
                    rounded
                    display="ratio"
                    restaurantSlug={restaurantSlug}
                  />
                </AbsoluteVStack>
              )
            }
            photo={restaurantPhoto}
            aspectFixed={aspectFixed}
            hoverable={hoverable}
          />
        </Link>
      )
    }
  )
)
