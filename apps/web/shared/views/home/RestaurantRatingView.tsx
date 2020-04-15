import { Restaurant } from '@dish/models'
import React, { forwardRef } from 'react'

import { RatingView, RatingViewProps } from './RatingView'

export type RestaurantRatingViewProps = Omit<
  RatingViewProps,
  'percent' | 'color'
> & {
  restaurant: Partial<Restaurant>
}

export const getRestaurantRating = (restaurant: Partial<Restaurant>) =>
  Math.round(restaurant.rating * 20)

export const getRankingColor = (percent: number) =>
  percent > 84 ? 'green' : percent > 60 ? 'orange' : 'red'

export const RestaurantRatingView = forwardRef(
  ({ restaurant, ...rest }: RestaurantRatingViewProps, ref) => {
    const percent = getRestaurantRating(restaurant)
    const color = getRankingColor(percent)
    return <RatingView ref={ref} percent={percent} color={color} {...rest} />
  }
)
