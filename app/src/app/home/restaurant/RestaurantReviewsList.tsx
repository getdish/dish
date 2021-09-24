import { graphql, order_by, query } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, Grid, HStack, Spacer, Text, VStack } from 'snackui'

import { useUserReviewQuery } from '../../hooks/useUserReview'
import { SlantedTitle } from '../../views/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentReviewButton'
import { RestaurantReview } from './RestaurantReview'

export const RestaurantReviewsList = memo(
  graphql(
    ({ restaurantSlug, before }: { restaurantSlug: string; numToShow?: number; before?: any }) => {
      const topReviewsInternal = query.review({
        limit: 6,
        where: {
          restaurant: {
            slug: {
              _eq: restaurantSlug,
            },
          },
          text: {
            _is_null: false,
          },
          source: {
            _is_null: true,
          },
        },
      })

      const topReviewsExternal = query.review({
        limit: 2,
        where: {
          restaurant: {
            slug: {
              _eq: restaurantSlug,
            },
          },
          text: {
            _is_null: false,
          },
          source: {
            _is_null: false,
          },
        },
        order_by: [
          {
            authored_at: order_by.asc,
            // reviews_aggregate: {
            //   count: order_by.desc,
            // },
          },
        ],
      })

      const topReviews = [
        ...topReviewsInternal,
        ...(topReviewsInternal.length < 2 ? topReviewsExternal : []),
      ]

      const [review] = useUserReviewQuery(restaurantSlug)

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
            {!topReviews.length && !review && (
              <VStack minHeight={100} alignItems="center" justifyContent="center">
                <Text opacity={0.5} fontSize={12}>
                  No reviews, yet!
                </Text>
              </VStack>
            )}
            <Grid itemMinWidth={320}>
              {!!review && <RestaurantReview wrapTagsRow hideRestaurantName review={review} />}

              {topReviews.map((review, i) => {
                return (
                  <VStack marginVertical={20} flex={1} key={i}>
                    <VStack flex={1} />
                    <RestaurantReview
                      hideGeneralTags
                      wrapTagsRow
                      hideRestaurantName
                      votable={false}
                      review={review}
                    />
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
