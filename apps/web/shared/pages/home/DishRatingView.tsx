import { TopCuisineDish } from '@dish/graph'
import { Text } from '@dish/ui'
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

    // TODO should be ratings
    if (percent < 4) {
      return null
    }

    // const s = rest.size
    // const size = s == 'xs' ? 20 : s === 'sm' ? 30 : s == 'md' ? 40 : 50
    // return (
    //   <Text position="absolute" top={-5} left="-2%" fontSize={size}>
    //     💎
    //   </Text>
    // )

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
