import { graphql } from '@dish/graph'
import {
  AbsoluteVStack,
  HStack,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image, StyleSheet } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantFavoriteStar } from './RestaurantFavoriteStar'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import { useRestaurantQuery } from './useRestaurantQuery'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  after?: any
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  return (
    <Suspense
      fallback={
        <VStack
          width="100%"
          height={138}
          borderBottomColor="#ddd"
          borderBottomWidth={1}
        />
      }
    >
      <RestaurantHeaderContent {...props} />
    </Suspense>
  )
}

const RestaurantHeaderContent = memo(
  graphql(({ state, restaurantSlug, after }: RestaurantHeaderProps) => {
    const restaurant = useRestaurantQuery(restaurantSlug)
    const om = useOvermind()
    const [r, g, b] = useCurrentLenseColor()
    return (
      <VStack width="100%">
        <VStack
          borderTopRightRadius={drawerBorderRadius - 1}
          borderTopLeftRadius={drawerBorderRadius - 1}
          overflow="hidden"
          position="relative"
          padding={20}
        >
          <HStack alignItems="center">
            <HStack position="relative">
              <RestaurantRatingViewPopover
                size="lg"
                restaurantSlug={restaurantSlug}
              />
            </HStack>
            <Spacer size={20} />

            <VStack flex={10}>
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

            {!after && !!restaurant.image && (
              <Image
                resizeMode="cover"
                source={{ uri: restaurant.image }}
                style={{
                  marginVertical: -10,
                  height: 115,
                  width: 115,
                  borderRadius: 100,
                }}
              />
            )}

            {after && <VStack maxWidth="50%">{after}</VStack>}
          </HStack>
        </VStack>
        <SmallTitle marginVertical={-18} divider="center">
          <VStack
            borderRadius={1000}
            shadowColor="rgba(0,0,0,0.1)"
            shadowRadius={8}
            shadowOffset={{ height: 2, width: 0 }}
          >
            <RestaurantFavoriteStar
              restaurantId={state?.restaurantId ?? restaurant.id}
              size="lg"
            />
          </VStack>
        </SmallTitle>
      </VStack>
    )
  })
)
