// // debug
import { graphql, order_by } from '@dish/graph'
import React, { Suspense, memo, useCallback, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LinearGradient,
  Paragraph,
  Spacer,
  VStack,
} from 'snackui'

import { getColorsForName } from '../../../helpers/getColorsForName'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import {
  CardFrame,
  cardFrameBorderRadius,
  cardFrameHeight,
  cardFrameWidth,
} from '../../views/CardFrame'
import { Link } from '../../views/Link'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { priceRange } from './RestaurantDetailRow'

export type RestaurantCardProps = {
  // size?: 'lg' | 'md' | 'sm'
  restaurantSlug: string
  restaurantId: string
  below?: any
}

export const RestaurantCard = (props: RestaurantCardProps) => {
  if (!props.restaurantSlug) {
    return <CardFrame />
  }
  return (
    <Suspense fallback={<CardFrame />}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )
}

export const RestaurantCardContent = memo(
  graphql(
    ({
      // size = 'lg',
      restaurantSlug,
      restaurantId,
      below,
    }: RestaurantCardProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      // const scale = size === 'lg' ? 1.2 : size == 'sm' ? 0.6 : 1
      const [hideInfo, setHideInfo] = useState(false)
      const [price_label, price_color, price_range] = priceRange(restaurant)
      const { lightColor, color, altColor } = getColorsForName(restaurant.name)

      const handleOnIsAtStart = useCallback((x) => {
        setHideInfo(!x)
      }, [])

      const restaurantPhoto = restaurant.photo_table({
        order_by: [{ photo: { quality: order_by.desc } }],
        limit: 1,
      })?.[0]?.photo.url

      return (
        <Link name="restaurant" params={{ slug: restaurantSlug }}>
          <CardFrame aspectFixed hoverable>
            <VStack
              className="safari-fix-overflow"
              width="100%"
              overflow="hidden"
              alignSelf="center"
              position="relative"
              borderRadius={cardFrameBorderRadius}
            >
              <AbsoluteVStack
                fullscreen
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                pointerEvents="none"
                transform={[{ scaleX: 0.98 }, { scaleY: 0.98 }]}
                zIndex={10}
                borderRadius={cardFrameBorderRadius - 2}
                shadowColor="#000"
                shadowRadius={40}
              ></AbsoluteVStack>
              <AbsoluteVStack
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                pointerEvents="none"
                fullscreen
                zIndex={10}
              >
                <LinearGradient
                  style={StyleSheet.absoluteFill}
                  colors={[`${lightColor}`, `${color}44`]}
                  start={[0, 0]}
                  end={[0.2, 0.2]}
                />
                <LinearGradient
                  style={StyleSheet.absoluteFill}
                  colors={[`${altColor}22`, `${altColor}44`]}
                  start={[1, 1]}
                  end={[0.6, 0.6]}
                />
              </AbsoluteVStack>
              <Image
                resizeMode="cover"
                style={{
                  width: cardFrameWidth,
                  height: cardFrameHeight,
                }}
                source={{ uri: restaurantPhoto }}
              />
            </VStack>
            <AbsoluteVStack
              alignItems="flex-start"
              fullscreen
              justifyContent="flex-end"
              pointerEvents="none"
              zIndex={10}
            >
              <AbsoluteVStack top={-10} left={-10} zIndex={20}>
                <RestaurantUpVoteDownVote
                  rounded
                  display="ratio"
                  restaurantSlug={restaurantSlug}
                />
              </AbsoluteVStack>

              <VStack
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                padding={15}
                alignItems="flex-start"
                spacing
                height="100%"
              >
                <HStack width="100%">
                  <VStack minWidth={60} flex={1} />
                  <VStack alignItems="flex-end">
                    <Paragraph
                      textAlign="right"
                      size="xl"
                      sizeLineHeight={0.7}
                      textShadowColor="#00000011"
                      textShadowRadius={1}
                      textShadowOffset={{ height: 2, width: 0 }}
                      color="#fff"
                      fontWeight="800"
                      letterSpacing={-0.5}
                    >
                      {restaurant.name}
                    </Paragraph>
                    <Spacer size="xs" />
                    <Paragraph textAlign="right" color="#fff" fontWeight="500">
                      {price_range}
                    </Paragraph>
                  </VStack>
                </HStack>
                <VStack flex={1} />
                {below}
              </VStack>
            </AbsoluteVStack>
          </CardFrame>
        </Link>
      )
    }
  )
)
