import { graphql } from '@dish/graph'
import React, { Suspense, useState } from 'react'
import { Box, HoverablePopover, Popover, VStack } from 'snackui'

import { queryRestaurant } from '../../queries/queryRestaurant'
import { RatingView } from './RatingView'

type Props = {
  slug: string
  size?: number
  floating?: boolean
}

export const RestaurantRatingView = (props: Props) => {
  return (
    <Suspense fallback={<VStack width={props.size} height={props.size} />}>
      <RestaurantRatingViewContent {...props} />
    </Suspense>
  )
}

export const RestaurantRatingViewContent = graphql(
  ({ slug, size = 32, floating }: Props) => {
    const [restaurant] = queryRestaurant(slug)
    const count = restaurant.reviews_aggregate({}).aggregate?.count({}) ?? 0
    const ratingViewProps = {
      rating: restaurant.rating * 20,
      size,
      floating,
    }

    return (
      <VStack pointerEvents="auto">
        <HoverablePopover
          allowHoverOnContent
          anchor="LEFT_BOTTOM"
          contents={(isOpen) => {
            if (isOpen) {
              return (
                <Box padding={15}>
                  <RatingView
                    {...ratingViewProps}
                    stacked
                    size={size * 0.66}
                    count={count}
                  />
                </Box>
              )
            }
            return null
          }}
        >
          <RatingView
            {...ratingViewProps}
            {...(size >= 48 && {
              count,
            })}
          />
        </HoverablePopover>
      </VStack>
    )
  }
)
