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
          minWidth={200}
          pointerEvents="auto"
          // flex-wrap spacing
          marginTop={15}
          borderRadius={20}
          maxWidth="98%"
          paddingHorizontal={0}
          paddingVertical={0}
          className={`animate-up ${
            selectedRestaurant ? 'active' : 'untouchable'
          }`}
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
          paddingHorizontal={16}
          paddingVertical={18}
          overflow="hidden"
          alignItems="center"
          borderRadius={20}
        >
          <VStack flex={5} overflow="hidden">
            <LinkButton
              key={restaurantSlug}
              name="restaurant"
              params={{ slug: restaurantSlug }}
            >
              <Text
                ellipse
                selectable
                fontSize={16}
                fontWeight="600"
                paddingRight={30}
              >
                {restaurant.name} &nbsp;
                <RestaurantAddressLinksRow
                  currentLocationInfo={
                    state?.currentLocationInfo ??
                    om.state.home.currentState.currentLocationInfo
                  }
                  showMenu
                  size="sm"
                  restaurantSlug={restaurantSlug}
                />
              </Text>
            </LinkButton>
            <Spacer size="sm" />
            <HStack>
              <RestaurantAddress
                size="sm"
                address={restaurant.address ?? ''}
                currentLocationInfo={state?.currentLocationInfo ?? {}}
              />
            </HStack>
          </VStack>

          {!!restaurant.image && (
            <>
              <Spacer size="sm" />
              <Image
                resizeMode="cover"
                source={{ uri: restaurant.image }}
                style={{
                  marginVertical: -50,
                  marginRight: -40,
                  height: 80,
                  width: 80,
                  borderRadius: 100,
                }}
              />
            </>
          )}
        </HStack>
      </>
    )
  })
)
