import { TopCuisineDish } from '@dish/graph'
import React, { forwardRef } from 'react'

import { RatingView, RatingViewProps } from './RatingView'

export type DishRatingViewProps = Omit<RatingViewProps, 'percent' | 'color'> & {
  dish: TopCuisineDish
}

export const getDishRatingPercent = (dish: TopCuisineDish) => {
  return (dish.rating ?? 0) * 10
}

export const getRankingColor = (rating: number | undefined) => {
  if (!rating) return
  return rating >= 0.8 ? 'green' : rating >= 0.5 ? 'orange' : 'red'
}

export const DishRatingView = forwardRef(
  ({ dish, ...rest }: DishRatingViewProps, ref) => {
    const percent = getDishRatingPercent(dish)
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
