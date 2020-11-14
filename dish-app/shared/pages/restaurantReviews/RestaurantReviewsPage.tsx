import { graphql } from '@dish/graph'
import React, { Suspense, memo, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  LoadingItem,
  LoadingItems,
  Modal,
  SmallTitle,
  Spacer,
  VStack,
} from 'snackui'

import { bgLight, bgLightHover } from '../../colors'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemReviews } from '../../state/home-types'
import { useOvermind } from '../../state/useOvermind'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { RestaurantBreakdown } from '../restaurant/RestaurantBreakdown'
import { RestaurantDishPhotos } from '../restaurant/RestaurantDishPhotos'
import { RestaurantReviewsList } from '../restaurant/RestaurantReviewsList'
import { useSelectedDish } from '../restaurant/useSelectedDish'

export default memo(function RestaurantReviewsPage() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'restaurantReviews') {
    return <RestaurantReviewsPageContent {...state} />
  }

  return null
})

const RestaurantReviewsPageContent = memo(
  graphql((props: HomeStateItemReviews) => {
    const { tagName, slug } = props
    const restaurant = useRestaurantQuery(slug)
    const title = `${restaurant.name} Reviews`
    const { selectedDish, setSelectedDishToggle } = useSelectedDish(tagName)

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

                {!!restaurant.id && (
                  <>
                    <VStack
                      backgroundColor={bgLight}
                      borderBottomColor={bgLightHover}
                      borderBottomWidth={1}
                    >
                      <VStack marginBottom={-1}>
                        <Suspense
                          fallback={
                            <VStack height={150}>
                              <LoadingItem />
                            </VStack>
                          }
                        >
                          <RestaurantDishPhotos
                            size={130}
                            max={40}
                            restaurantSlug={slug}
                            restaurantId={restaurant.id ?? undefined}
                            selectable
                            selected={selectedDish}
                            onSelect={setSelectedDishToggle}
                          />
                        </Suspense>
                      </VStack>
                    </VStack>

                    <Spacer />

                    <Suspense fallback={<LoadingItems />}>
                      <RestaurantBreakdown
                        borderless
                        showScoreTable
                        tagName={selectedDish ?? tagName}
                        restaurantId={restaurant.id}
                        restaurantSlug={slug}
                      />
                    </Suspense>

                    <Suspense fallback={null}>
                      <RestaurantReviewsList
                        restaurantSlug={slug}
                        restaurantId={restaurant.id}
                      />
                    </Suspense>
                  </>
                )}
              </VStack>
            </VStack>
          </ScrollView>
        </Modal>
      </>
    )
  })
)
