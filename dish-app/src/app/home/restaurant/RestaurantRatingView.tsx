import { graphql } from '@dish/graph'
import React, { memo } from 'react'

import {
  getRankingColor,
  getRestaurantRating,
} from '../../../helpers/getRestaurantRating'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { RatingView, RatingViewProps } from '../../views/RatingView'

export type RestaurantRatingViewProps = Omit<
  Pick<RatingViewProps, 'size'>,
  'percent' | 'color'
> & {
  restaurantSlug: string
  rating?: number
  subtle?: boolean
}

export default memo(
  graphql(function RestaurantRatingView(props: RestaurantRatingViewProps) {
    let { restaurantSlug, rating, ...rest } = props
    // optionally fetch
    if (typeof rating === 'undefined') {
      const [restaurant] = queryRestaurant(restaurantSlug)
      rating = restaurant.rating
    }
    const percent = getRestaurantRating(rating ?? 0)
    const color = getRankingColor(percent)
    return <RatingView percent={percent} color={color} {...rest} />
  })
)
