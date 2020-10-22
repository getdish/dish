import { Store, useStore } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, HStack, SmallTitle, VStack } from 'snackui'

import { bgLight } from '../../colors'
import { drawerWidthMax } from '../../constants'
import { useIsNarrow } from '../../hooks/useIs'
import { CloseButton } from '../../views/ui/CloseButton'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { RestaurantAddCommentButton } from './RestaurantAddCommentButton'
import { RestaurantPointsBreakdown } from './RestaurantPointsBreakdown'
import { RestaurantSourcesOverview } from './RestaurantSourcesOverview'

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
    title = 'Overview',
    restaurantId,
    restaurantSlug,
    closable,
    borderless,
    showScoreTable,
  }: {
    title?: string
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
        <HStack
          position="relative"
          marginHorizontal={10}
          marginBottom={-10}
          alignItems="center"
          justifyContent="center"
        >
          <SlantedTitle fontWeight="700">{title}</SlantedTitle>

          <AbsoluteVStack top={0} right={0}>
            <Suspense fallback={null}>
              <RestaurantAddCommentButton
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </Suspense>
          </AbsoluteVStack>
        </HStack>
        {closable && (
          <AbsoluteVStack zIndex={1000} top={10} right={10}>
            <CloseButton onPress={store.toggleShowComments} />
          </AbsoluteVStack>
        )}
        <HStack
          flexWrap={isSmall ? 'wrap' : 'nowrap'}
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
            minWidth={260}
            // maxWidth={drawerWidthMax / 2 - 40}
            flex={2}
            overflow="hidden"
            paddingHorizontal={10}
            paddingVertical={20}
            alignItems="center"
            spacing={10}
          >
            <Suspense fallback={null}>
              <RestaurantSourcesOverview restaurantSlug={restaurantSlug} />
            </Suspense>
          </VStack>

          <VStack
            borderRadius={10}
            maxWidth={isSmall ? 400 : drawerWidthMax / 2.5 - 40}
            borderWidth={1}
            borderColor="#eee"
            padding={10}
            minWidth={220}
            margin={10}
            flex={1}
            backgroundColor={bgLight}
            overflow="hidden"
          >
            <SmallTitle>Base Score</SmallTitle>
            <RestaurantPointsBreakdown
              showTable={showScoreTable}
              restaurantSlug={restaurantSlug}
              restaurantId={restaurantId}
            />
          </VStack>
        </HStack>
      </VStack>
    )
  }
)
