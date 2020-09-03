import { graphql, query } from '@dish/graph'
import {
  AbsoluteVStack,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'

import { CloseButton } from './CloseButton'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantReview } from './RestaurantReview'
import { RestaurantScoreBreakdown } from './RestaurantScoreBreakdown'
import { SlantedTitle } from './SlantedTitle'

export class RestaurantReviewsDisplayStore extends Store<{ id: string }> {
  showComments = false

  toggleShowComments() {
    this.showComments = !this.showComments
  }
}

// BRING BACK LENSE VOTING
// ADD IN DISH BREAKDOWN

export const RestaurantRatingBreakdown = memo(
  ({
    restaurantId,
    restaurantSlug,
    closable,
  }: {
    restaurantId: string
    restaurantSlug: string
    closable?: boolean
  }) => {
    const store = useStore(RestaurantReviewsDisplayStore, { id: restaurantId })

    return (
      <VStack maxWidth="100%" position="relative">
        <HStack marginBottom={-20} alignItems="center" justifyContent="center">
          <SlantedTitle fontWeight="600">Review Breakdown</SlantedTitle>
        </HStack>
        {closable && (
          <AbsoluteVStack zIndex={1000} top={18} right={11}>
            <CloseButton onPress={store.toggleShowComments} />
          </AbsoluteVStack>
        )}
        <HStack
          flexWrap="wrap"
          flexDirection="row-reverse"
          overflow="hidden"
          flex={1}
          maxWidth="100%"
          margin={10}
          borderWidth={1}
          borderColor="#ddd"
          borderRadius={12}
          paddingHorizontal={18}
          paddingVertical={18}
        >
          <VStack minWidth={260} marginBottom={20} flex={1} overflow="hidden">
            <SmallTitle>Points</SmallTitle>
            <RestaurantScoreBreakdown restaurantSlug={restaurantSlug} />

            <Spacer size="xl" />

            <SmallTitle>Lense Votes</SmallTitle>
            <Spacer />
            <RestaurantLenseVote restaurantId={restaurantId} />

            <Spacer size="xl" />

            <SmallTitle>Dishes</SmallTitle>
          </VStack>

          {/*
          <Spacer size="xl" />
          <Divider vertical />
          <Spacer size="xl" /> */}

          <VStack minWidth={260} flex={1.15} overflow="hidden" spacing={10}>
            <SmallTitle>Reviews</SmallTitle>
            <HStack alignItems="stretch">
              <Suspense fallback={null}>
                <RestaurantAddCommentButton
                  flex={1}
                  restaurantId={restaurantId}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>
            </HStack>

            <Suspense fallback={null}>
              <RestaurantReviewsList restaurantId={restaurantId} />
            </Suspense>
          </VStack>
        </HStack>
      </VStack>
    )
  }
)

const RestaurantReviewsList = memo(
  graphql(
    ({
      restaurantId,
      numToShow,
    }: {
      restaurantId: string
      numToShow?: number
    }) => {
      let topReviews = query.review({
        limit: 3,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      })

      return (
        <VStack spacing="lg">
          {topReviews.map((review, i) => (
            <RestaurantReview
              key={i}
              userName={review.user.username}
              reviewText={review.text}
            />
          ))}
          {!topReviews.length && (
            <VStack minHeight={100} alignItems="center" justifyContent="center">
              <Text opacity={0.5} fontSize={12}>
                No reviews, yet!
              </Text>
            </VStack>
          )}
        </VStack>
      )
    }
  )
)
