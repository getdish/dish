import { graphql, query } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, Grid, HStack, Spacer, Text, VStack } from 'snackui'

import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
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

      const { review: ownReview } = useUserReviewCommentQuery(restaurantId)

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
            {!topReviews.length && !ownReview && (
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
            <Grid itemMinWidth={280}>
              <RestaurantReview reviewId={ownReview.id} />
              {topReviews.map((review, i) => {
                return (
                  <VStack flex={1} key={i}>
                    <VStack flex={1} />
                    <RestaurantReview reviewId={review.id} />
                  </VStack>
                )
              })}
            </Grid>
          </Suspense>
        </VStack>
      )
    }
  )
)
