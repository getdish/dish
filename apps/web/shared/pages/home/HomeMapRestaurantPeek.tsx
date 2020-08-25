import { Restaurant } from '@dish/graph'
import { graphql } from '@dish/graph/src'
import { AbsoluteVStack, Box, HStack, Spacer, Text, VStack } from '@dish/ui'
import React, { memo, useEffect, useState } from 'react'
import { Image } from 'react-native'

import { useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantRatingViewPopover } from './RestaurantRatingViewPopover'
import { useRestaurantQuery } from './useRestaurantQuery'

export const HomeMapRestaurantPeek = memo(
  graphql(() => {
    const om = useOvermind()
    const [slug, setSlug] = useState('')
    const selectedSlug = om.state.home.selectedRestaurant?.slug
    const hoveredSlug =
      (om.state.home.hoveredRestaurant &&
        om.state.home.hoveredRestaurant.slug) ||
      ''

    console.log('slug', slug, hoveredSlug)

    useEffect(() => {
      setSlug(selectedSlug)
    }, [selectedSlug])

    useEffect(() => {
      setSlug(hoveredSlug)
    }, [hoveredSlug])

    const state = om.state.home.currentState

    if (state.type === 'restaurant' && slug === state.restaurantSlug) {
      return null
    }

    const containerWrap = (children: any) => {
      return (
        <Box
          overflow="visible"
          minWidth={200}
          pointerEvents="auto"
          // flex-wrap spacing
          marginTop={15}
          maxWidth="98%"
          paddingHorizontal={0}
          paddingVertical={0}
          className={`animate-up ${slug ? 'active' : 'untouchable'}`}
          backgroundColor="rgba(0,0,0,0.8)"
          shadowColor="rgba(0,0,0,0.35)"
          shadowRadius={10}
        >
          {children}
        </Box>
      )
    }

    if (!slug) {
      return containerWrap(null)
    }

    const restaurant = useRestaurantQuery(slug)

    return containerWrap(
      <>
        <AbsoluteVStack zIndex={100} top={-10} right={-10}>
          <RestaurantRatingViewPopover size="sm" restaurantSlug={slug} />
        </AbsoluteVStack>
        <HStack
          flex={1}
          paddingHorizontal={12}
          paddingVertical={12}
          overflow="hidden"
          alignItems="center"
          borderRadius={20}
        >
          <VStack flex={5} overflow="hidden">
            <LinkButton key={slug} name="restaurant" params={{ slug }}>
              <Text
                ellipse
                selectable
                fontSize={16}
                fontWeight="600"
                paddingRight={30}
                color="#fff"
              >
                {restaurant.name} &nbsp;
                <RestaurantAddressLinksRow
                  currentLocationInfo={
                    state?.currentLocationInfo ??
                    om.state.home.currentState.currentLocationInfo
                  }
                  showMenu
                  size="sm"
                  restaurantSlug={slug}
                />
              </Text>
            </LinkButton>
            <Spacer size="xs" />
            <HStack>
              <RestaurantAddress
                size="sm"
                address={restaurant.address ?? ''}
                currentLocationInfo={state?.currentLocationInfo ?? null}
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
