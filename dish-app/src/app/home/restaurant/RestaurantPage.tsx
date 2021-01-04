import { graphql } from '@dish/graph'
import React, { Suspense, memo, useEffect, useRef } from 'react'
import { ScrollView } from 'react-native'
import { LoadingItem, LoadingItems, Spacer, VStack } from 'snackui'

import { bgLight, bgLightHover, darkBlue } from '../../../constants/colors'
import { getMinLngLat } from '../../../helpers/getLngLat'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { homeStore } from '../../state/home'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { ContentScrollView } from '../../views/ContentScrollView'
import { PageTitleTag } from '../../views/PageTitleTag'
import { StackDrawer } from '../../views/StackDrawer'
import { HomeStackViewProps } from '../HomeStackViewProps'
import { RestaurantBreakdown } from './RestaurantBreakdown'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantReviewsList } from './RestaurantReviewsList'
import { useSelectedDish } from './useSelectedDish'

type Props = HomeStackViewProps<HomeStateItemRestaurant>

export default function RestaurantPageContainer(props: Props) {
  return (
    <StackDrawer closable>
      <RestaurantPage {...props} />
    </StackDrawer>
  )
}

const RestaurantPage = memo(
  graphql((props: Props) => {
    const { item } = props
    const { restaurantSlug, section, sectionSlug } = item
    const restaurant = useRestaurantQuery(restaurantSlug)
    const coords = restaurant?.location?.coordinates
    const scrollView = useRef<ScrollView>()
    const { selectedDish, setSelectedDishToggle } = useSelectedDish(
      section === 'reviews' ? sectionSlug : null
    )

    usePageLoadEffect(
      props,
      () => {
        if (!coords?.[0]) {
          return
        }
        homeStore.updateHomeState({
          id: item.id,
          center: {
            lng: coords?.[0],
            lat: coords?.[1],
          },
          span: getMinLngLat(item.span, 0.004, 0.004),
        })
      },
      [coords]
    )

    // TODO it wont scroll on initial load, maybe suspense issue
    const scroller = scrollView.current
    useEffect(() => {
      if (!scroller) return
      if (!item.sectionSlug) return
      scroller.scrollTo({ y: 550, animated: true })
      // return series([
      //   () => fullyIdle({ max: 1000 }),
      //   () => {

      //   },
      // ])
    }, [scroller, item.sectionSlug])

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <ContentScrollView ref={scrollView} id="restaurant">
          {/* HEADER */}
          {/* -1 margin bottom to overlap bottom border */}
          <VStack
            backgroundColor={bgLight}
            borderBottomColor={bgLightHover}
            borderBottomWidth={1}
          >
            <Suspense
              fallback={
                <VStack height={600} width="100%">
                  <LoadingItem size="lg" />
                </VStack>
              }
            >
              <RestaurantHeader
                color={darkBlue}
                minHeight={450}
                showImages
                restaurantSlug={restaurantSlug}
              />
            </Suspense>

            <Spacer />

            <VStack marginBottom={-1} position="relative" zIndex={1}>
              <Suspense
                fallback={
                  <VStack height={150}>
                    <LoadingItem />
                  </VStack>
                }
              >
                <RestaurantDishPhotos
                  size={140}
                  max={40}
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id ?? undefined}
                  selectable
                  selected={selectedDish}
                  onSelect={setSelectedDishToggle}
                />
              </Suspense>
            </VStack>
          </VStack>

          <Spacer size="xl" />

          <Suspense fallback={<LoadingItems />}>
            <RestaurantBreakdown
              tagSlug={selectedDish}
              borderless
              showScoreTable
              restaurantSlug={restaurantSlug}
              restaurantId={restaurant.id}
            />
          </Suspense>

          <Spacer size="xl" />

          <VStack
            backgroundColor="#fcfcfc"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="#f2f2f2"
            paddingVertical={20}
          >
            <Suspense fallback={null}>
              <RestaurantReviewsList
                restaurantSlug={restaurantSlug}
                restaurantId={restaurant.id}
              />
            </Suspense>
          </VStack>

          <Spacer size="xl" />

          <VStack flex={1} marginBottom={20} width="100%" alignSelf="center">
            <Suspense fallback={null}>
              <RestaurantMenu restaurantSlug={restaurantSlug} />
            </Suspense>
          </VStack>
        </ContentScrollView>
      </>
    )
  })
)
