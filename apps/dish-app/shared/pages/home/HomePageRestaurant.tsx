import { graphql } from '@dish/graph'
import { HStack, LoadingItems, SmallTitle, Spacer, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'

import { bgLight } from '../../colors'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { omStatic } from '../../state/om'
import { PageTitleTag } from '../../views/ui/PageTitleTag'
import { getMinLngLat } from './getLngLat'
import { HomePagePaneProps } from './HomePagePaneProps'
import { HomeScrollView } from './HomeScrollView'
import { HomeStackDrawer } from './HomeStackDrawer'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'
import { RestaurantTagsRow } from './RestaurantTagsRow'
import { usePageLoadEffect } from './usePageLoadEffect'
import { useRestaurantQuery } from './useRestaurantQuery'

type Props = HomePagePaneProps<HomeStateItemRestaurant>

export default function HomePageRestaurantContainer(props: Props) {
  return (
    <HomeStackDrawer closable borderWidth={6} borderColor={bgLight}>
      <HomePageRestaurant {...props} />
    </HomeStackDrawer>
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

        <HomeScrollView paddingTop={0}>
          {/* HEADER */}
          <RestaurantHeader restaurantSlug={slug} />

          <Spacer size="xl" />
          <Spacer size="sm" />

          <Suspense fallback={<LoadingItems />}>
            <VStack alignItems="center">
              <HStack minWidth={380}>
                <RestaurantDetailRow
                  centered
                  justifyContent="center"
                  restaurantSlug={slug}
                  flex={1}
                />
              </HStack>
            </VStack>

            <Spacer size="xl" />

            <VStack width="100%">
              <Suspense fallback={null}>
                <RestaurantDishPhotos
                  size={160}
                  restaurantSlug={slug}
                  restaurantId={restaurant.id ?? undefined}
                />
              </Suspense>
            </VStack>

            <Spacer />

            <VStack>
              <HStack
                paddingHorizontal="5%"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
                <RestaurantTagsRow
                  size="sm"
                  restaurantSlug={slug}
                  restaurantId={restaurant.id}
                  spacing={8}
                  grid
                  max={5}
                />
              </HStack>
            </VStack>

            <Spacer />

            <Suspense fallback={null}>
              <RestaurantRatingBreakdown
                showScoreTable
                restaurantSlug={slug}
                restaurantId={restaurant.id}
              />
            </Suspense>

            <Spacer size="xl" />

            <VStack flex={1} marginBottom={20} width="100%">
              <VStack
                margin={3}
                borderWidth={1}
                borderColor="#eee"
                borderRadius={10}
                padding={10}
              >
                <SmallTitle divider="off">Menu</SmallTitle>
                <Spacer />
                <Suspense fallback={null}>
                  <RestaurantMenu restaurantSlug={slug} />
                </Suspense>
              </VStack>

              <Spacer size="xl" />
            </VStack>

            <VStack width="100%">
              <SmallTitle>Images</SmallTitle>
              <HStack
                width="100%"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
              >
                {(restaurant.photos() ?? []).slice(0, 10).map((photo, key) => (
                  <Image
                    key={key}
                    source={{ uri: photo }}
                    style={{
                      height: 180,
                      width: '31%',
                      marginRight: 10,
                      marginBottom: 10,
                      borderRadius: 12,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </HStack>
            </VStack>
          </Suspense>

          {/* bottom space */}
          <VStack height={200} />
        </HomeScrollView>
      </>
    )
  })
)
