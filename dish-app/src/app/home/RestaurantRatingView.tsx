import { graphql } from '@dish/graph'
import React from 'react'

import { queryRestaurant } from '../../queries/queryRestaurant'
import { RatingView } from './RatingView'

export const RestaurantRatingView = graphql(
  ({
    slug,
    size = 32,
    floating,
  }: {
    slug: string
    size?: number
    floating?: boolean
  }) => {
    const [restaurant] = queryRestaurant(slug)
    return (
      <RatingView
        rating={restaurant.rating * 20}
        size={size}
        floating={floating}
        count={restaurant.reviews_aggregate({}).aggregate?.count({}) ?? 0}
      />
    )
  }
)
