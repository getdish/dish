import { TopCuisineDish } from '@dish/models'
import React, { forwardRef } from 'react'

import { RatingView, RatingViewProps } from './RatingView'

export type DishRatingViewProps = Omit<RatingViewProps, 'percent' | 'color'> & {
  dish: TopCuisineDish
}

export const getDishRating = (dish: TopCuisineDish) =>
  Math.round((dish.rating / 5) * 100)

export const getRankingColor = (percent: number) =>
  percent > 84 ? 'green' : percent > 60 ? 'orange' : 'red'

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
