import { graphql } from '@dish/graph'
import React, { Suspense, memo, useMemo } from 'react'
import { HStack, LoadingItem, Spacer, VStack } from 'snackui'

import { bgLight, bgLightHover, darkBlue, grey, lightGrey } from '../../colors'
import { getMinLngLat } from '../../helpers/getLngLat'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollView } from '../../views/ContentScrollView'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { StackDrawer } from '../../views/StackDrawer'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { StackViewProps } from '../StackViewProps'
import { RestaurantBreakdown } from './RestaurantBreakdown'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantReviewsList } from './RestaurantReviewsList'
import { useSelectedDish } from './useSelectedDish'

type Props = StackViewProps<HomeStateItemRestaurant>

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
    const { restaurantSlug, tagName } = item
    const restaurant = useRestaurantQuery(restaurantSlug)
    const coords = restaurant?.location?.coordinates
    const { selectedDish, setSelectedDishToggle } = useSelectedDish(tagName)

    usePageLoadEffect(props.isActive && restaurant.id, () => {
      omStatic.actions.home.updateHomeState({
        id: item.id,
        type: 'restaurant',
        searchQuery: item.searchQuery,
        restaurantSlug: item.restaurantSlug,
        center: {
          lng: coords?.[0],
          lat: coords?.[1],
        },
        span: getMinLngLat(item.span, 0.0025, 0.0025),
      })
    })

    const headerElement = useMemo(() => {
      return (
        <Suspense
          fallback={
            <VStack height={497} width="100%">
              <LoadingItem size="lg" />
            </VStack>
          }
        >
          <RestaurantHeader
            color={darkBlue}
            minHeight={450}
            showImages
            restaurantSlug={restaurantSlug}
            after={
              <VStack
                className="ease-in-out"
                hoverStyle={{
                  transform: [{ scale: 1.0125 }],
                }}
                marginBottom={-50}
                marginTop={0}
                marginRight={20}
              >
                <RestaurantCard
                  restaurantSlug={restaurantSlug}
                  restaurantId={restaurant.id}
                />
              </VStack>
            }
            below={
              <>
                <RestaurantOverview
                  fullHeight
                  size="lg"
                  restaurantSlug={restaurantSlug}
                />
                <Spacer size="xl" />
                <HStack maxHeight={100} overflow="hidden" flexWrap="wrap">
                  <RestaurantTagsRow
                    size="sm"
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurant.id}
                    spacing={6}
                    grid
                    max={10}
                  />
                </HStack>
              </>
            }
          />
        </Suspense>
      )
    }, [restaurantSlug, restaurant.id])

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <ContentScrollView id="restaurant">
          {/* HEADER */}
          <VStack
            backgroundColor={bgLight}
            borderBottomColor={bgLightHover}
            borderBottomWidth={1}
          >
            {headerElement}

            {/* -1 margin bottom to overlap bottom border */}
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

          <Suspense fallback={null}>
            <RestaurantBreakdown
              tagName={selectedDish}
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
