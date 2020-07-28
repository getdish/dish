import { graphql } from '@dish/graph/src'
import { AbsoluteVStack, Box, HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { Image } from 'react-native'

import { useOvermind } from '../../state/useOvermind'
import { LinkButton } from '../../views/ui/LinkButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useRestaurantQuery } from './useRestaurantQuery'

export const HomeMapRestaurantPeek = memo(
  graphql(() => {
    const om = useOvermind()
    const selectedRestaurant = om.state.home.selectedRestaurant
    const state = om.state.home.currentState

    const containerWrap = (children: any) => {
      return (
        <Box
          overflow="visible"
          width="55%"
          maxWidth={250}
          padding={0}
          className={`animate-up ${selectedRestaurant ? 'active' : ''}`}
          pointerEvents="auto"
        >
          {children}
        </Box>
      )
    }

    if (!selectedRestaurant) {
      return containerWrap(null)
    }

    const restaurantSlug = selectedRestaurant.slug ?? ''
    const restaurant = useRestaurantQuery(restaurantSlug)

    return containerWrap(
      <>
        <AbsoluteVStack zIndex={100} top={-10} right={-10}>
          <RestaurantRatingViewPopover
            size="sm"
            restaurantSlug={restaurantSlug}
          />
        </AbsoluteVStack>
        <HStack
          flex={1}
          paddingHorizontal={10}
          paddingVertical={14}
          overflow="hidden"
          alignItems="center"
        >
          <Spacer size="sm" />
          <VStack flex={5} overflow="hidden">
            <LinkButton
              key={restaurantSlug}
              name="restaurant"
              params={{ slug: restaurantSlug }}
            >
              <Text
                ellipse
                selectable
                fontSize={18}
                fontWeight="300"
                paddingRight={30}
              >
                {restaurant.name}
              </Text>
            </LinkButton>
            <Spacer size="sm" />
            <RestaurantAddressLinksRow
              currentLocationInfo={
                state?.currentLocationInfo ??
                om.state.home.currentState.currentLocationInfo
              }
              showMenu
              size="sm"
              restaurantSlug={restaurantSlug}
            />
            <Spacer size="md" />
            <HStack>
              <RestaurantAddress
                size="sm"
                address={restaurant.address ?? ''}
                currentLocationInfo={state?.currentLocationInfo ?? {}}
              />
            </HStack>
          </VStack>

          {!!restaurant.image && (
            <Image
              resizeMode="cover"
              source={{ uri: restaurant.image }}
              style={{
                marginVertical: -10,
                height: 70,
                width: 70,
                borderRadius: 100,
              }}
            />
          )}
        </HStack>
      </>
    )
  })
)
