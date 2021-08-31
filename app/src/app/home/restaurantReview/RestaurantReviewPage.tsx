import { graphql, query } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'
import { LoadingItems, Modal, Text, VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemReview } from '../../../types/homeTypes'
import { homeStore, useIsHomeTypeActive } from '../../homeStore'
import { useUserReviewQuery } from '../../hooks/useUserReview'
import { useUserStore } from '../../userStore'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SmallTitle } from '../../views/SmallTitle'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { RestaurantReviewEdit } from '../restaurant/RestaurantReviewEdit'

export default memo(function RestaurantReviewPage() {
  const isActive = useIsHomeTypeActive('restaurantReview')
  if (!isActive) return null
  return <RestaurantReviewPageContent />
})

function RestaurantReviewPageContent() {
  const store = useStoreInstance(homeStore)
  const state = store.getLastStateByType('restaurantReview')
  return (
    <Modal width="98%" maxWidth={700} visible>
      <PaneControlButtons>
        <StackViewCloseButton />
      </PaneControlButtons>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          maxWidth: '100%',
        }}
        contentContainerStyle={{
          maxWidth: '100%',
        }}
      >
        <Suspense fallback={<LoadingItems />}>
          <HomePageReviewContent state={state} />
        </Suspense>
      </ScrollView>
    </Modal>
  )
}

const HomePageReviewContent = memo(
  graphql(function HomePageReviewContent({ state }: { state: HomeStateItemReview }) {
    const { user } = useUserStore()
    if (!state.restaurantSlug) {
      return (
        <VStack>
          <Text>no slug?</Text>
        </VStack>
      )
    }
    const [restaurant] = queryRestaurant(state.restaurantSlug)
    const [review] = user?.name ? useUserReviewQuery(state.restaurantSlug) : []

    if (!restaurant) {
      return null
    }

    return (
      <VStack width="100%" maxWidth="100%" flex={1}>
        <SmallTitle fontWeight="600">{restaurant.name}</SmallTitle>
        <Suspense fallback={<LoadingItems />}>
          <RestaurantReviewEdit review={review} restaurantSlug={state.restaurantSlug} />
        </Suspense>
      </VStack>
    )
  })
)
