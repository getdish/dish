import { graphql, query } from '@dish/graph'
import React, { memo } from 'react'
import { Text, VStack } from 'snackui'

import { RestaurantReview } from './RestaurantReview'

export const RestaurantReviewsList = memo(
  graphql(({ restaurantId }: { restaurantId: string; numToShow?: number }) => {
    let topReviews = query.review({
      limit: 4,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
        // text: {
        //   _neq: '',
        // },
      },
    })

    return (
      <VStack spacing="xl" maxWidth="100%" overflow="hidden">
        {topReviews.map((review, i) => {
          return <RestaurantReview key={i} reviewId={review.id} />
        })}
        {!topReviews.length && (
          <VStack minHeight={100} alignItems="center" justifyContent="center">
            <Text opacity={0.5} fontSize={12}>
              No reviews, yet!
            </Text>
          </VStack>
        )}
      </VStack>
    )
  })
)
