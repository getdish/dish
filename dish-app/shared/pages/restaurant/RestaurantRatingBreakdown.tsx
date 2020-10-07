import { AbsoluteVStack, HStack, SmallTitle, Spacer, VStack } from '@dish/ui'
import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'

import { bg, bgLight, brandColor } from '../../colors'
import { drawerWidthMax } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { CloseButton } from '../../views/ui/CloseButton'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantPointsBreakdown } from './RestaurantPointsBreakdown'
import { RestaurantReviewsList } from './RestaurantReviewsList'

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
    borderless,
    showScoreTable,
  }: {
    restaurantId: string
    restaurantSlug: string
    closable?: boolean
    showScoreTable?: boolean
    borderless?: boolean
  }) => {
    const isSmall = useIsNarrow()
    const store = useStore(RestaurantReviewsDisplayStore, { id: restaurantId })

    return (
      <VStack
        overflow="hidden"
        maxWidth="100%"
        width="100%"
        position="relative"
      >
        <HStack marginBottom={-20} alignItems="center" justifyContent="center">
          <SlantedTitle fontWeight="700">Reviews</SlantedTitle>
        </HStack>
        {closable && (
          <AbsoluteVStack zIndex={1000} top={10} right={10}>
            <CloseButton onPress={store.toggleShowComments} />
          </AbsoluteVStack>
        )}
        <HStack
          flexWrap={isSmall ? 'wrap' : 'nowrap'}
          flexDirection="row-reverse"
          overflow="hidden"
          flex={1}
          maxWidth="100%"
          margin={10}
          minWidth={300}
          borderWidth={borderless ? 0 : 1}
          borderColor="#eee"
          borderRadius={12}
          paddingVertical={18}
          justifyContent="center"
        >
          <VStack
            borderRadius={10}
            maxWidth={isSmall ? 400 : drawerWidthMax / 2.5 - 40}
            borderWidth={1}
            borderColor="#eee"
            padding={10}
            minWidth={260}
            margin={10}
            flex={1}
            backgroundColor={bgLight}
            overflow="hidden"
          >
            <SmallTitle color={bg}>Points</SmallTitle>
            <RestaurantPointsBreakdown
              showTable={showScoreTable}
              restaurantSlug={restaurantSlug}
            />

            <Spacer size="sm" />

            <SmallTitle color={bg}>Lense Votes</SmallTitle>
            <Spacer />
            <RestaurantLenseVote restaurantId={restaurantId} />

            <Spacer size="xl" />

            <SmallTitle color={bg}>Dishes</SmallTitle>
          </VStack>

          <VStack
            minWidth={260}
            // maxWidth={drawerWidthMax / 2 - 40}
            flex={2}
            overflow="hidden"
            paddingHorizontal={10}
            spacing={10}
          >
            <HStack
              overflow="hidden"
              maxWidth="100%"
              marginVertical={8}
              alignItems="stretch"
            >
              <Suspense fallback={null}>
                <RestaurantAddCommentButton
                  flex={1}
                  restaurantId={restaurantId}
                  restaurantSlug={restaurantSlug}
                />
              </Suspense>
            </HStack>

            <Suspense fallback={null}>
              <ScrollView
                style={{
                  maxWidth: '100%',
                }}
                contentContainerStyle={{
                  maxWidth: '100%',
                }}
              >
                <RestaurantReviewsList restaurantId={restaurantId} />
              </ScrollView>
            </Suspense>
          </VStack>
        </HStack>
      </VStack>
    )
  }
)
