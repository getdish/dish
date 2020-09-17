import React, { forwardRef } from 'react'

import { RatingView, RatingViewProps } from '../../pages/home/RatingView'

export type DishRatingViewProps = Omit<RatingViewProps, 'percent' | 'color'> & {
  rating: number
}

export const getDishRatingPercent = (rating: number) => {
  return (rating ?? 0) * 10
}

export const getRankingColor = (rating: number | undefined) => {
  if (!rating) return
  return rating >= 0.8 ? 'green' : rating >= 0.5 ? 'orange' : 'red'
}

export const DishRatingView = forwardRef(
  ({ rating, ...rest }: DishRatingViewProps, ref) => {
    const percent = getDishRatingPercent(rating)
    const color = getRankingColor(percent)

    // TODO should be ratings
    if (percent < 4) {
      return null
    }

    return (
      <RatingView
        hideDecimal
        hideEmoji
        ref={ref}
        percent={percent}
        color={color}
        {...rest}
      />
    )
  }
)
