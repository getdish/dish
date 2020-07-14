import { graphql } from '@dish/graph'
import { HStack, SmallTitle, Spacer, Text, VStack, useOverlay } from '@dish/ui'
import React, { memo } from 'react'

import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDetailRow } from './RestaurantDetailRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useRestaurantQuery } from './useRestaurantQuery'

export const RestaurantHeader = memo(
  graphql(
    ({
      state,
      restaurantSlug,
    }: {
      state?: HomeStateItemRestaurant
      restaurantSlug: any
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const om = useOvermind()
      return (
        <>
          <HStack>
            <HStack position="relative">
              <RestaurantRatingViewPopover
                size="lg"
                restaurantSlug={restaurantSlug}
              />
            </HStack>
            <Spacer size={16} />
            <VStack flex={1}>
              <Text
                selectable
                fontSize={restaurant.name?.length > 25 ? 30 : 36}
                fontWeight="800"
                paddingRight={30}
              >
                {restaurant.name}
              </Text>
              <Spacer size="sm" />
              <RestaurantAddressLinksRow
                currentLocationInfo={
                  state?.currentLocationInfo ??
                  om.state.home.currentState.currentLocationInfo
                }
                showMenu
                size="lg"
                restaurantSlug={restaurantSlug}
              />
              <Spacer size="md" />
              <HStack>
                <Text selectable color="#777" fontSize={16}>
                  {restaurant.address}
                </Text>
              </HStack>
              <Spacer size={6} />
            </VStack>
          </HStack>
          <Spacer />
          <SmallTitle divider="center">
            <RestaurantFavoriteStar restaurantId={restaurant.id} size="lg" />
          </SmallTitle>
          <Spacer />
          <VStack alignItems="center">
            <HStack minWidth={400}>
              <RestaurantDetailRow
                centered
                justifyContent="center"
                restaurantSlug={restaurantSlug}
                flex={1}
              />
            </HStack>
          </VStack>
        </>
      )
    }
  )
)
