import { TopCuisineDish } from '@dish/graph'
import React, { forwardRef } from 'react'

import { RatingView, RatingViewProps } from './RatingView'

export type DishRatingViewProps = Omit<RatingViewProps, 'percent' | 'color'> & {
  dish: TopCuisineDish
}

export const getDishRating = (dish: TopCuisineDish) => {
  return Math.round(dish.rating * 2)
}

export const getRankingColor = (percent: number) => {
  return percent >= 8 ? 'green' : percent >= 5 ? 'orange' : 'red'
}

export const DishRatingView = forwardRef(
  ({ dish, ...rest }: DishRatingViewProps, ref) => {
    const percent = getDishRating(dish)
    const color = getRankingColor(percent)
    return (
      <RatingView
        ref={ref}
        hideEmoji
        percent={percent}
        color={color}
        {...rest}
      />
    )
  }
)
