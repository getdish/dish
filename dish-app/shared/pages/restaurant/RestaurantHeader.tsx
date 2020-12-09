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
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { SmallButton } from '../../views/ui/SmallButton'
import { ratingToRatio } from './ratingToRatio'
import { RestaurantAddress } from './RestaurantAddress'
import { RestaurantAddressLinksRow } from './RestaurantAddressLinksRow'
import { RestaurantCard } from './RestaurantCard'
import { RestaurantDeliveryButtons } from './RestaurantDeliveryButtons'
import { openingHours } from './RestaurantDetailRow'
import {
  RestaurantFavoriteButton,
  RestaurantFavoriteStar,
} from './RestaurantFavoriteButton'
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

      const contentLeftWidth = width - 60
      const restaurantId = restaurant.id

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
              <VStack
                pointerEvents="auto"
                position="relative"
                className="fade-photos"
              >
                <RestaurantPhotosRow
                  restaurantSlug={restaurantSlug}
                  width={260}
                  height={200}
                />
              </VStack>
              <VStack
                marginTop={-20}
                minWidth={minWidth}
                borderTopRightRadius={drawerBorderRadius - 1}
                borderTopLeftRadius={drawerBorderRadius - 1}
                width="100%"
                position="relative"
                pointerEvents="none"
              >
                <VStack flex={1}>
                  <HStack alignItems="center">
                    <RestaurantUpVoteDownVote
                      activeTags={{}}
                      restaurantSlug={restaurantSlug}
                      restaurantId={restaurantId}
                      score={restaurant.score ?? 0}
                      ratio={ratingToRatio(restaurant.rating ?? 1)}
                    />
                    <Spacer size="xl" />
                    <Text
                      alignSelf="flex-start"
                      selectable
                      lineHeight={20}
                      maxHeight={20}
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
                  </HStack>
                  <HStack
                    pointerEvents="auto"
                    flex={1}
                    alignItems="flex-start"
                    minWidth={280}
                  >
                    {spacer}
                    <VStack flex={10} overflow="hidden">
                      <Spacer size="lg" />
                      <VStack
                        pointerEvents="auto"
                        overflow="hidden"
                        paddingRight={20}
                      >
                        <HStack
                          alignItems="center"
                          flexWrap="wrap"
                          maxWidth="100%"
                        >
                          <RestaurantFavoriteStar restaurantId={restaurantId} />

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
                                restaurantId={restaurantId}
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
                        </HStack>
                      </VStack>
                    </VStack>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
          </ContentScrollViewHorizontal>
        </VStack>
      )
    }
  )
)
