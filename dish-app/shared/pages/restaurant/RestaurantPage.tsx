import { graphql } from '@dish/graph'
import { HStack, LinearGradient, LoadingItem, Spacer, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { StyleSheet } from 'react-native'

import { bgLight, blue, lightBlue } from '../../colors'
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
import { SlantedTitle } from '../../views/ui/SlantedTitle'
import { StackViewProps } from '../StackViewProps'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantDishPhotos } from './RestaurantDishPhotos'
import { RestaurantHeader } from './RestaurantHeader'
import { RestaurantMenu } from './RestaurantMenu'
import { RestaurantRatingBreakdown } from './RestaurantRatingBreakdown'

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
    const { restaurantSlug } = item
    const restaurant = useRestaurantQuery(restaurantSlug)
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

        <ContentScrollView id="restaurantPage" paddingTop={0}>
          {/* <LinearGradient
            colors={[bgLight, 'rgba(255,255,255,0)']}
            style={[
              StyleSheet.absoluteFill,
              {
                maxHeight: 400,
                left: -100,
                right: -100,
                transform: [{ rotate: '-12.5deg' }, { translateY: -100 }],
              },
            ]}
          /> */}

          {/* HEADER */}
          <VStack backgroundColor={bgLight}>
            <Suspense
              fallback={
                <VStack height={497} width="100%">
                  <LoadingItem size="lg" />
                </VStack>
              }
            >
              <RestaurantHeader
                color={blue}
                showImages
                restaurantSlug={restaurantSlug}
                after={
                  <VStack
                    className="ease-in-out"
                    hoverStyle={{
                      transform: [{ scale: 1.0125 }],
                    }}
                    marginBottom={-100}
                    marginTop={-40}
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
                      maxChars={250}
                      inline
                      restaurantSlug={restaurantSlug}
                      limit={2}
                    />
                    <Spacer size="lg" />
                    <HStack flexWrap="wrap">
                      <RestaurantTagsRow
                        size="sm"
                        restaurantSlug={restaurantSlug}
                        restaurantId={restaurant.id}
                        spacing={10}
                        grid
                        max={5}
                      />
                    </HStack>
                  </>
                }
              />
            </Suspense>

            <HStack marginTop={-15} justifyContent="center">
              <SlantedTitle fontWeight="700">Best dishes</SlantedTitle>
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
                max={40}
                restaurantSlug={restaurantSlug}
                restaurantId={restaurant.id ?? undefined}
              />
            </Suspense>

            <Spacer size="xs" />
          </VStack>

          <Spacer size="xl" />

          <Suspense fallback={null}>
            <RestaurantRatingBreakdown
              borderless
              showScoreTable
              restaurantSlug={restaurantSlug}
              restaurantId={restaurant.id}
            />
          </Suspense>

          <Spacer size="xl" />

          <VStack
            flex={1}
            marginBottom={20}
            width="100%"
            maxWidth={500}
            alignSelf="center"
          >
            <Suspense fallback={null}>
              <RestaurantMenu restaurantSlug={restaurantSlug} />
            </Suspense>
          </VStack>
        </ContentScrollView>
      </>
    )
  })
)
