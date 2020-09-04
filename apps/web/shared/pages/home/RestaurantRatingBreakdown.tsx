import {
  AbsoluteVStack,
  Divider,
  HStack,
  SmallTitle,
  Spacer,
  VStack,
} from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'

import { CloseButton } from './CloseButton'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantReviewsList } from './RestaurantReviewsList'
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
          <AbsoluteVStack zIndex={1000} top={10} right={6}>
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
          borderColor="#eee"
          borderRadius={12}
          paddingVertical={18}
        >
          <VStack
            borderRadius={10}
            borderWidth={1}
            borderColor="#eee"
            padding={10}
            minWidth={260}
            margin={10}
            flex={1}
            overflow="hidden"
          >
            <SmallTitle>Points</SmallTitle>
            <RestaurantScoreBreakdown restaurantSlug={restaurantSlug} />

            <Spacer size="sm" />

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

          <VStack
            minWidth={260}
            flex={1.15}
            overflow="hidden"
            paddingHorizontal={10}
            spacing={10}
          >
            <SmallTitle divider="off">Reviews</SmallTitle>
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
