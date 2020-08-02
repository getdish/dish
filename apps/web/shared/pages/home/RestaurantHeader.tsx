import { graphql } from '@dish/graph'
import { HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import React, { Suspense, memo } from 'react'
import { Image, ScrollView } from 'react-native'

import { drawerBorderRadius } from '../../constants'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { useOvermind } from '../../state/useOvermind'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useCurrentLenseColor } from './useCurrentLenseColor'
import { useRestaurantQuery } from './useRestaurantQuery'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  after?: any
  afterAddress?: any
  size?: 'sm' | 'md'
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
  graphql(
    ({
      state,
      restaurantSlug,
      after,
      afterAddress,
      size,
    }: RestaurantHeaderProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const om = useOvermind()
      const [r, g, b] = useCurrentLenseColor()
      const padding = <Spacer size={size === 'sm' ? 10 : 20} />
      return (
        <VStack width="100%">
          <VStack
            borderTopRightRadius={drawerBorderRadius - 1}
            borderTopLeftRadius={drawerBorderRadius - 1}
            // overflow="hidden"
            maxWidth="100%"
            position="relative"
            overflow="hidden"
          >
            {padding}
            <HStack alignItems="center">
              {padding}
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
                  fontSize={
                    (restaurant.name?.length > 25 ? 32 : 34) *
                    (size === 'sm' ? 0.8 : 1)
                  }
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
                <Spacer size="sm" />
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack alignItems="center">
                    <RestaurantAddress
                      size="sm"
                      address={restaurant.address ?? ''}
                      currentLocationInfo={state?.currentLocationInfo ?? {}}
                    />
                    {afterAddress}
                  </HStack>
                </ScrollView>
              </VStack>
              {!after && !!restaurant.image && (
                <>
                  <Image
                    resizeMode="cover"
                    source={{ uri: restaurant.image }}
                    style={{
                      marginVertical: -60,
                      marginRight: -30,
                      height: 200,
                      width: 200,
                      borderRadius: 100,
                    }}
                  />
                </>
              )}
              {after && (
                <>
                  <VStack maxWidth="50%">{after}</VStack>
                  {padding}
                </>
              )}
            </HStack>
            {padding}
          </VStack>
          <SmallTitle marginVertical={-18} divider="center">
            <VStack
              borderRadius={1000}
              shadowColor="rgba(0,0,0,0.1)"
              shadowRadius={8}
              shadowOffset={{ height: 2, width: 0 }}
            >
              <Suspense fallback={null}>
                <RestaurantFavoriteButton
                  restaurantId={state?.restaurantId ?? restaurant.id}
                  size="lg"
                />
              </Suspense>
            </VStack>
          </SmallTitle>
        </VStack>
      )
    }
  )
)
