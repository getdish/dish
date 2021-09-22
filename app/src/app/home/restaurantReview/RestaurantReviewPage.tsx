import { graphql, query } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'
import { LoadingItems, Modal, Text, Toast, VStack } from 'snackui'

import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemReview } from '../../../types/homeTypes'
import { homeStore, useIsHomeTypeActive } from '../../homeStore'
import { useUserReviewQuery, useUserReviewQueryMutations } from '../../hooks/useUserReview'
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
    <Modal width="98%" maxWidth={720} visible>
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
          <VStack padding={20}>
            <HomePageReviewContent state={state} />
          </VStack>
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
    const reviewQuery = user ? useUserReviewQuery(state.restaurantSlug) : []
    let [review] = reviewQuery
    const reviewMutations = useUserReviewQueryMutations({
      restaurantId: restaurant?.id,
      reviewQuery,
    })

    if (!restaurant) {
      return null
    }

    return (
      <VStack width="100%" maxWidth="100%" flex={1}>
        <SmallTitle fontWeight="600">{restaurant.name}</SmallTitle>
        <Suspense fallback={<LoadingItems />}>
          <RestaurantReviewEdit
            wrapTagsRow
            review={review}
            restaurantSlug={state.restaurantSlug}
            onEdit={(text) => {
              if (!restaurant || !user) return
              if (!review) {
                review = {
                  restaurant_id: restaurant.id,
                  user_id: user.id,
                } as any
              }
              review.text = text
              reviewMutations.upsertReview(review)
              Toast.show('Saved review')
            }}
          />
        </Suspense>
      </VStack>
    )
  })
)
