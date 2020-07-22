import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { memo } from 'react'
import { Image, StyleSheet } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantAddress } from './RestaurantAddress'
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
      hideDetails,
    }: {
      state?: HomeStateItemRestaurant
      restaurantSlug: any
      hideDetails?: boolean
    }) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const om = useOvermind()
      return (
        <VStack width="100%">
          <VStack
            borderTopRightRadius={drawerBorderRadius - 1}
            borderTopLeftRadius={drawerBorderRadius - 1}
            overflow="hidden"
            position="relative"
            padding={20}
          >
            {!!restaurant.image && (
              <AbsoluteVStack fullscreen zIndex={-1}>
                <AbsoluteVStack
                  backgroundColor="rgba(255,255,255,0.25)"
                  fullscreen
                  zIndex={1}
                />
                <Image
                  resizeMode="cover"
                  source={{ uri: restaurant.image }}
                  style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                  colors={[
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,1)',
                    'rgba(255,255,255,0)',
                  ]}
                  startPoint={[0, 0]}
                  endPoint={[1, 0]}
                  style={StyleSheet.absoluteFill}
                />
              </AbsoluteVStack>
            )}
            <HStack alignItems="center">
              <HStack position="relative">
                <RestaurantRatingViewPopover
                  size="lg"
                  restaurantSlug={restaurantSlug}
                />
              </HStack>
              <Spacer size={20} />
              <VStack flex={1}>
                <Text
                  selectable
                  fontSize={restaurant.name?.length > 25 ? 32 : 34}
                  fontWeight="300"
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
                  <RestaurantAddress
                    size="lg"
                    address={restaurant.address ?? ''}
                    currentLocationInfo={state?.currentLocationInfo ?? {}}
                  />
                </HStack>
              </VStack>
            </HStack>
          </VStack>
          <SmallTitle marginTop={-18} divider="center">
            <RestaurantFavoriteStar restaurantId={restaurant.id} size="lg" />
          </SmallTitle>
          {!hideDetails && (
            <>
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
          )}
        </VStack>
      )
    }
  )
)
