import { graphql } from '@dish/graph'
import React, { SuspenseProps, useState } from 'react'
import { FallbackProps } from 'react-error-boundary'
import { Box, HoverablePopover, Popover, VStack } from 'snackui'

import { queryRestaurant } from '../../queries/queryRestaurant'
import { suspense } from '../hoc/suspense'
import { RatingView } from './RatingView'

export const RestaurantRatingView = suspense(
  graphql(
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
  ),
  (props) => <VStack width={props.size} height={props.size} />
)
