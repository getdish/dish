import { graphql, query } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack } from 'snackui'

import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantReview } from './RestaurantReview'

export const RestaurantReviewsList = memo(
  graphql(
    ({
      restaurantSlug,
      restaurantId,
    }: {
      restaurantSlug: string
      restaurantId: string
      numToShow?: number
    }) => {
      const topReviews = query.review({
        limit: 4,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      })

      return (
        <VStack paddingHorizontal="3%">
          <HStack
            position="relative"
            marginHorizontal={10}
            alignItems="center"
            justifyContent="center"
          >
            <SlantedTitle fontWeight="700">Reviews</SlantedTitle>

            <AbsoluteVStack top={0} right={0}>
              <Suspense fallback={null}>
                <RestaurantAddCommentButton
                  restaurantId={restaurantId}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>
            </AbsoluteVStack>
          </HStack>
          <Spacer />

          <Suspense fallback={null}>
            <VStack spacing="xl" maxWidth="100%" overflow="hidden">
              {topReviews.map((review, i) => {
                return <RestaurantReview key={i} reviewId={review.id} />
              })}
              {!topReviews.length && (
                <VStack
                  minHeight={100}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text opacity={0.5} fontSize={12}>
                    No reviews, yet!
                  </Text>
                </VStack>
              )}
            </VStack>
          </Suspense>
        </VStack>
      )
    }
  )
)
