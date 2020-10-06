import { graphql } from '@dish/graph'
import { HStack, Spacer, StackProps, Text, VStack, useDebounce } from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'
import { Dimensions } from 'react-native'

import { drawerBorderRadius, drawerWidthMax } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { Link } from '../../views/ui/Link'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'

type RestaurantHeaderProps = {
  state?: HomeStateItemRestaurant
  restaurantSlug: any
  after?: any
  afterAddress?: any
  size?: 'sm' | 'md'
  below?: any
  showImages?: boolean
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  return <RestaurantHeaderContent {...props} />
}

const RestaurantHeaderContent = memo(
  graphql(
    ({
      state,
      restaurantSlug,
      after,
      below,
      afterAddress,
      showImages,
      size,
    }: RestaurantHeaderProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const om = useOvermind()
      // const [r, g, b] = useCurrentLenseColor()
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const restaurantId = state?.restaurantId ?? restaurant.id
      const nameLen = restaurant.name?.length
      const [width, setWidth] = useState(
        Math.min(Dimensions.get('window').width, drawerWidthMax)
      )
      const scale = width < 400 ? 0.75 : width < 600 ? 0.8 : 1
      const setWidthSlow = useDebounce(setWidth, 100)
      const fontSize =
        scale *
        ((nameLen > 24 ? 26 : nameLen > 18 ? 30 : 46) *
          (size === 'sm' ? 0.8 : 1))

      return (
        <VStack
          width="100%"
          position="relative"
          zIndex={100}
          onLayout={(e) => {
            setWidthSlow(e.nativeEvent.layout.width)
          }}
        >
          <VStack
            borderTopRightRadius={drawerBorderRadius - 1}
            borderTopLeftRadius={drawerBorderRadius - 1}
            maxWidth="100%"
            position="relative"
          >
            <HStack alignItems="center">
              <HStack
                flex={1}
                paddingTop={paddingPx * 1.5}
                alignItems="flex-start"
              >
                {spacer}
                <VStack flex={10} overflow="hidden">
                  <Text
                    selectable
                    lineHeight={42}
                    fontSize={fontSize}
                    fontWeight="700"
                  >
                    {restaurant.name}
                  </Text>
                  <Spacer />
                  <HStack alignItems="center" paddingRight={20}>
                    <VStack>
                      <HStack>
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
                        <RestaurantDeliveryButtons
                          showLabels
                          restaurantSlug={restaurantSlug}
                        />
                      </HStack>
                      <Spacer size="md" />
                      <HStack>
                        <RestaurantAddress
                          size="xs"
                          address={restaurant.address ?? ''}
                          currentLocationInfo={
                            state?.currentLocationInfo ?? null
                          }
                        />
                        <VStack width={30} />
                        <Link
                          className="underline-link"
                          name="restaurantHours"
                          params={{ slug: restaurantSlug }}
                          fontSize={14}
                          color={open_color}
                          ellipse
                        >
                          {open_text} ({next_time})
                        </Link>
                      </HStack>
                      {afterAddress}
                      {spacer}
                    </VStack>
                  </HStack>

                  {below}
                </VStack>
              </HStack>

              <VStack flex={1} minWidth={30} />

              {after}
            </HStack>
          </VStack>
        </VStack>
      )
    }
  )
)

export const CircleButton = (props: StackProps) => {
  return (
    <VStack
      borderRadius={1000}
      shadowColor="rgba(0,0,0,0.1)"
      backgroundColor="#fff"
      shadowRadius={8}
      width={38}
      height={38}
      alignItems="center"
      justifyContent="center"
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={1}
      borderColor="transparent"
      hoverStyle={{
        borderColor: '#aaa',
      }}
      {...props}
    />
  )
}
