import { graphql } from '@dish/graph'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  LoadingItems,
  Modal,
  SmallTitle,
  Spacer,
  VStack,
} from 'snackui'

import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useOvermind } from '../../state/om'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { RestaurantRatingBreakdown } from '../restaurant/RestaurantRatingBreakdown'
import { RestaurantReviewsList } from '../restaurant/RestaurantReviewsList'

export default memo(function RestaurantReviewsPage() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'restaurantReviews') {
    return (
      <RestaurantReviewsPageContent
        restaurantId={state.restaurantId}
        restaurantSlug={state.restaurantSlug}
      />
    )
  }

  return null
})

const RestaurantReviewsPageContent = memo(
  graphql((props: { restaurantId: string; restaurantSlug: string }) => {
    const { restaurantId, restaurantSlug } = props
    const restaurant = useRestaurantQuery(restaurantSlug)
    const title = `${restaurant.name} Reviews`
    return (
      <>
        <PageTitleTag>{title}</PageTitleTag>
        <Modal width="98%" height="98%" maxWidth={880}>
          <ScrollView
            style={{
              width: '100%',
              maxWidth: '100%',
            }}
          >
            <VStack
              pointerEvents="auto"
              width="100%"
              height="100%"
              flex={1}
              paddingBottom={40}
            >
              <AbsoluteVStack top={5} right={33} zIndex={1000}>
                <StackViewCloseButton />
              </AbsoluteVStack>
              <VStack paddingTop={10}>
                <SmallTitle>{restaurant.name}</SmallTitle>

                <Spacer size="lg" />

                <Suspense fallback={<LoadingItems />}>
                  <RestaurantRatingBreakdown
                    borderless
                    showScoreTable
                    {...props}
                  />
                </Suspense>

                <Suspense fallback={null}>
                  <RestaurantReviewsList
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                  />
                </Suspense>
              </VStack>
            </VStack>
          </ScrollView>
        </Modal>
      </>
    )
  })
)
