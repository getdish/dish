import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo } from 'react'
import { HStack, Spacer, Text, VStack } from 'snackui'

import { drawerBorderRadius, isWeb } from '../../constants'
import { useAppDrawerWidthInner } from '../../hooks/useAppDrawerWidth'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { SmallButton } from '../../views/ui/SmallButton'
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
  color?: string
  minHeight?: number
}

export const RestaurantHeader = (props: RestaurantHeaderProps) => {
  return (
    <Suspense fallback={<VStack minHeight={props.minHeight} />}>
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
      below,
      afterAddress,
      color,
      showImages,
      minHeight,
      size,
    }: RestaurantHeaderProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [open_text, open_color, next_time] = openingHours(restaurant)
      const paddingPx = size === 'sm' ? 10 : 30
      const spacer = <Spacer size={paddingPx} />
      const nameLen = restaurant.name?.length
      const drawerWidth = useAppDrawerWidthInner()
      const minWidth = 600
      const width = Math.max(minWidth, drawerWidth)
      const scale = width < 601 ? 0.75 : drawerWidth < 700 ? 0.85 : 1
      const fontSize =
        scale *
        ((nameLen > 24 ? 26 : nameLen > 18 ? 30 : 46) *
          (size === 'sm' ? 0.8 : 1))

      return (
        <VStack
          width="100%"
          position="relative"
          zIndex={100}
          minWidth={minWidth}
        >
          <ContentScrollViewHorizontal
            style={{
              width: '100%',
              maxWidth: isWeb ? '100vw' : '100%',
              minHeight,
            }}
            contentContainerStyle={{
              width,
            }}
          >
            <VStack
              borderTopRightRadius={drawerBorderRadius - 1}
              borderTopLeftRadius={drawerBorderRadius - 1}
              width="100%"
              position="relative"
            >
              <HStack alignItems="center">
                <HStack
                  flex={1}
                  paddingTop={paddingPx * 1.5}
                  alignItems="flex-start"
                  minWidth={280}
                >
                  {spacer}
                  <VStack flex={10} overflow="hidden">
                    <Text
                      selectable
                      lineHeight={42}
                      fontSize={fontSize}
                      fontWeight="700"
                      color={color ?? '#000'}
                    >
                      {restaurant.name}
                    </Text>
                    <Spacer size="lg" />
                    <VStack overflow="hidden" paddingRight={20}>
                      <HStack flexWrap="wrap" maxWidth="100%">
                        <Suspense fallback={null}>
                          <RestaurantAddressLinksRow
                            currentLocationInfo={
                              state?.currentLocationInfo ?? null
                            }
                            showMenu
                            size="lg"
                            restaurantSlug={restaurantSlug}
                          />
                          <Spacer size="xs" />
                          <RestaurantDeliveryButtons
                            showLabels
                            restaurantSlug={restaurantSlug}
                          />
                          <Spacer size="xs" />
                          <RestaurantAddress
                            size="xs"
                            address={restaurant.address ?? ''}
                            currentLocationInfo={
                              state?.currentLocationInfo ?? null
                            }
                          />
                        </Suspense>
                        <SmallButton
                          backgroundColor="transparent"
                          name="restaurantHours"
                          params={{ slug: restaurantSlug }}
                          fontSize={14}
                          color={open_color}
                          ellipse
                          before={
                            <Clock
                              size={14}
                              color="#999"
                              style={{ marginRight: 5 }}
                            />
                          }
                          children={`${open_text} (${next_time})`}
                        />
                      </HStack>
                      {afterAddress}
                      <Spacer />
                    </VStack>

                    {below}
                  </VStack>
                </HStack>

                <VStack flex={1} minWidth={30} />

                {after}
              </HStack>
            </VStack>
          </ContentScrollViewHorizontal>
        </VStack>
      )
    }
  )
)
