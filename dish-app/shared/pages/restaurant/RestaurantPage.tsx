import { graphql } from '@dish/graph'
import { HStack, LoadingItem, LoadingItems, Spacer, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'

import { bg, bgLight } from '../../colors'
import { getMinLngLat } from '../../helpers/getLngLat'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { omStatic } from '../../state/omStatic'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { StackViewProps } from '../StackViewProps'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'

type Props = StackViewProps<HomeStateItemRestaurant>

export default function HomePageRestaurantContainer(props: Props) {
  return (
    <StackDrawer closable>
      <HomePageRestaurant {...props} />
    </StackDrawer>
  )
}

const HomePageRestaurant = memo(
  graphql((props: Props) => {
    const { item } = props
    const slug = item.restaurantSlug
    const restaurant = useRestaurantQuery(slug)
    const coords = restaurant?.location?.coordinates

    usePageLoadEffect(props.isActive && restaurant.id, () => {
      omStatic.actions.home.updateHomeState({
        id: item.id,
        type: 'restaurant',
        searchQuery: item.searchQuery,
        restaurantSlug: item.restaurantSlug,
        restaurantId: restaurant.id,
        center: {
          lng: coords?.[0],
          lat: coords?.[1],
        },
        span: getMinLngLat(item.span, 0.0025, 0.0025),
      })
    })

    return (
      <>
        <PageTitleTag>
          Dish - {restaurant?.name ?? ''} has the best [...tags] dishes.
        </PageTitleTag>

        <ContentScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader showImages restaurantSlug={slug} />

          <Spacer size="xl" />

          <VStack justifyContent="center" alignItems="center">
            <VStack minWidth={300} width="90%" maxWidth={600}>
              <RestaurantDetailRow
                centered
                justifyContent="center"
                restaurantSlug={slug}
                flex={1}
              />
            </VStack>
          </VStack>

          <Spacer size="lg" />

          <Suspense fallback={<LoadingItems />}>
            <HStack justifyContent="center">
              <SlantedTitle fontWeight="700">What it's good at</SlantedTitle>
            </HStack>
            <Spacer size="xs" />
            <Suspense
              fallback={
                <VStack height={160}>
                  <LoadingItem />
                </VStack>
              }
            >
              <RestaurantDishPhotos
                size={160}
                restaurantSlug={slug}
                restaurantId={restaurant.id ?? undefined}
              />
            </Suspense>

            <Spacer size="xl" />

            <Suspense fallback={null}>
              <RestaurantRatingBreakdown
                borderless
                // showScoreTable
                restaurantSlug={slug}
                restaurantId={restaurant.id}
              />
            </Suspense>

            <Spacer size="xl" />

            <VStack flex={1} marginBottom={20} width="100%">
              <VStack margin={3} borderRadius={10} padding={10}>
                <SlantedTitle fontWeight="700" alignSelf="center">
                  Menu
                </SlantedTitle>
                <Spacer />
                <Suspense fallback={null}>
                  <RestaurantMenu restaurantSlug={slug} />
                </Suspense>
              </VStack>

              <Spacer size="xl" />
            </VStack>
          </Suspense>
        </ContentScrollView>
      </>
    )
  })
)
