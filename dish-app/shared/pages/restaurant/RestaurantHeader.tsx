import { graphql } from '@dish/graph'
import { Clock } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { AbsoluteVStack, HStack, Spacer, Text, VStack } from 'snackui'

import { drawerBorderRadius, isWeb, searchBarHeight } from '../../constants'
import { useAppDrawerWidthInner } from '../../hooks/useAppDrawerWidth'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { HomeStateItemRestaurant } from '../../state/home-types'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { RestaurantOverview } from '../../views/restaurant/RestaurantOverview'
import { RestaurantTagsRow } from '../../views/restaurant/RestaurantTagsRow'
import { SmallButton } from '../../views/ui/SmallButton'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'

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
      const [width, setWidth] = useState(Math.max(minWidth, drawerWidth))
      const scale = width < 601 ? 0.75 : drawerWidth < 700 ? 0.85 : 1
      const fontSize =
        scale *
        ((nameLen > 24 ? 26 : nameLen > 18 ? 30 : 40) *
          (size === 'sm' ? 0.8 : 1))

      const contentLeftWidth = width - 250

      return (
        <VStack
          onLayout={(x) => {
            setWidth(x.nativeEvent.layout.width)
          }}
          width="100%"
          position="relative"
          zIndex={100}
        >
          <ContentScrollViewHorizontal
            style={{
              width: '100%',
              maxWidth: isWeb ? '100vw' : '100%',
              minHeight,
            }}
            contentContainerStyle={{
              minWidth: width,
            }}
          >
            <VStack>
              <VStack zIndex={-1} position="relative" className="fade-photos">
                <RestaurantPhotosRow
                  restaurantSlug={restaurantSlug}
                  width={200}
                  height={200}
                />
              </VStack>
              <VStack
                marginTop={-110}
                minWidth={minWidth}
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
                        alignSelf="flex-start"
                        selectable
                        lineHeight={28}
                        maxHeight={28}
                        fontSize={fontSize}
                        fontWeight="600"
                        color="#fff"
                        padding={20}
                        backgroundColor="rgba(0,0,0,0.85)"
                        shadowColor="#000"
                        shadowOpacity={0.2}
                        shadowRadius={5}
                        shadowOffset={{ height: 3, width: 0 }}
                        borderRadius={10}
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
                      </VStack>

                      <Spacer size="lg" />

                      <VStack>
                        <HStack marginTop={10} flexWrap="wrap">
                          <VStack
                            flex={1}
                            minWidth={280}
                            maxWidth={contentLeftWidth}
                          >
                            <HStack
                              maxHeight={76}
                              overflow="hidden"
                              flexWrap="wrap"
                            >
                              <RestaurantTagsRow
                                size="sm"
                                restaurantSlug={restaurantSlug}
                                restaurantId={restaurant.id}
                                spacing={10}
                                grid
                                max={10}
                              />
                            </HStack>
                            <Spacer />
                            <RestaurantOverview
                              fullHeight
                              size="lg"
                              restaurantSlug={restaurantSlug}
                            />
                          </VStack>

                          <Spacer size="xxl" />

                          <VStack
                            marginTop={-90}
                            marginBottom={-30}
                            className="ease-in-out"
                            // opacity={isScrolled ? 0 : 1}
                            transform={[{ scale: 0.8 }]}
                            // hoverStyle={{
                            //   transform: [{ scale: 1 }, { translateY: -20 }],
                            // }}
                          >
                            <RestaurantCard
                              restaurantSlug={restaurantSlug}
                              restaurantId={restaurant.id}
                              size="md"
                            />
                          </VStack>
                        </HStack>
                      </VStack>
                    </VStack>
                  </HStack>
                </HStack>
              </VStack>
            </VStack>
          </ContentScrollViewHorizontal>
        </VStack>
      )
    }
  )
)
