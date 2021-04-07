import { RestaurantQuery, graphql } from '@dish/graph'
import React from 'react'
import { Box, HoverablePopover, VStack } from 'snackui'

import { queryRestaurant } from '../../queries/queryRestaurant'
import { suspense } from '../hoc/suspense'
import { RatingView } from './RatingView'

const ratingCount = (restaurant: RestaurantQuery) => {
  return restaurant.reviews_aggregate({}).aggregate?.count({}) ?? 0
}

export const RestaurantRatingView = suspense(
  graphql(({ slug, size = 32, floating }: { slug: string; size?: number; floating?: boolean }) => {
    const [restaurant] = queryRestaurant(slug)
    if (!restaurant) {
      return null
    }
    const ratingViewProps = {
      rating: (restaurant.rating ?? 0) * 20,
      size,
      floating,
    }

    // console.log(
    //   'TODO SHOW SERVICE + VIBE',
    //   restaurant
    //     .tags({
    //       where: {
    //         tag: {
    //           id: {
    //             _in: [
    //               '30d67fcc-759b-4cd6-8241-400028de9196',
    //               '5da93fbe-5715-43b4-8b15-6521e3897bd9',
    //             ],
    //           },
    //         },
    //       },
    //     })
    //     .map((rtag) => {
    //       rtag.rating
    //       rtag.upvotes
    //       rtag.votes_ratio
    //       rtag.score
    //       return { ...rtag }
    //     })
    // )

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
                    count={ratingCount(restaurant)}
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
              count: ratingCount(restaurant),
            })}
          />
        </HoverablePopover>
      </VStack>
    )
  }),
  (props) => <VStack width={props.size} height={props.size} />
)
