import { graphql } from '@dish/graph'
import React, { memo } from 'react'

import { getRankingColor, getRestaurantRating } from './getRestaurantRating'
import { RatingView, RatingViewProps } from './RatingView'
import { useRestaurantQuery } from './useRestaurantQuery'

export type RestaurantRatingViewProps = Omit<
  Pick<RatingViewProps, 'size'>,
  'percent' | 'color'
> & {
  restaurantSlug: string
  rating?: number
}

export default memo(
  graphql(function RestaurantRatingView(props: RestaurantRatingViewProps) {
    let { restaurantSlug, rating, ...rest } = props
    // optionally fetch
    if (typeof rating === 'undefined') {
      const restaurant = useRestaurantQuery(restaurantSlug)
      rating = restaurant.rating
    }
    const percent = getRestaurantRating(rating ?? 0)
    const color = getRankingColor(percent)
    return <RatingView percent={percent} color={color} {...rest} />
  })
)
