import { graphql, query } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, Grid, HStack, Spacer, Text, VStack } from 'snackui'

import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { SlantedTitle } from '../../views/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentReviewButton'
import { RestaurantReview } from './RestaurantReview'

export const RestaurantReviewsList = memo(
  graphql(
    ({ restaurantSlug, before }: { restaurantSlug: string; numToShow?: number; before?: any }) => {
      const topReviews = query.review({
        limit: 4,
        where: {
          restaurant: {
            slug: {
              _eq: restaurantSlug,
            },
          },
        },
      })

      const { review: ownReview } = useUserReviewCommentQuery(restaurantSlug)

      return (
        <VStack paddingHorizontal="3%">
          <HStack
            position="relative"
            marginHorizontal={10}
            alignItems="center"
            justifyContent="center"
          >
            <SlantedTitle size="xs" marginTop={-32} fontWeight="700">
              Reviews
            </SlantedTitle>

            <AbsoluteVStack top={-30} right={0}>
              <Suspense fallback={null}>
                <RestaurantAddCommentButton restaurantSlug={restaurantSlug} />
              </Suspense>
            </AbsoluteVStack>
          </HStack>

          <Spacer />

          {before}

          <Suspense fallback={null}>
            {!topReviews.length && !ownReview && (
              <VStack minHeight={100} alignItems="center" justifyContent="center">
                <Text opacity={0.5} fontSize={12}>
                  No reviews, yet!
                </Text>
              </VStack>
            )}
            <Grid itemMinWidth={320}>
              {ownReview && <RestaurantReview restaurantSlug={restaurantSlug} />}

              {topReviews.map((review, i) => {
                return (
                  <VStack marginVertical={20} flex={1} key={i}>
                    <VStack flex={1} />
                    <RestaurantReview hideRestaurantName review={review} />
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
