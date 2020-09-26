import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  LoadingItems,
  Modal,
  SmallTitle,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { pageWidthMax } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useOvermind } from '../../state/om'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { RestaurantRatingBreakdown } from '../restaurant/RestaurantRatingBreakdown'

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
    const restaurant = useRestaurantQuery(props.restaurantSlug)
    const title = `${restaurant.name} Reviews`
    return (
      <>
        <PageTitleTag>{title}</PageTitleTag>
        <Modal maxWidth={pageWidthMax} height="98%">
          <VStack width="100%" height="100%" flex={1}>
            <AbsoluteVStack top={5} right={26}>
              <StackViewCloseButton />
            </AbsoluteVStack>
            <VStack paddingTop={10}>
              <SmallTitle>{restaurant.name}</SmallTitle>
              <Suspense fallback={<LoadingItems />}>
                <RestaurantRatingBreakdown {...props} />
              </Suspense>
            </VStack>
          </VStack>
        </Modal>
      </>
    )
  })
)
