import { graphql, query } from '@dish/graph'
import { Text, VStack } from '@dish/ui'
import React, { memo } from 'react'

import { RestaurantReview } from './RestaurantReview'

export const RestaurantReviewsList = memo(
  graphql(({ restaurantId }: { restaurantId: string; numToShow?: number }) => {
    let topReviews = query.review({
      limit: 4,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
      },
    })

    return (
      <VStack spacing="xl">
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
