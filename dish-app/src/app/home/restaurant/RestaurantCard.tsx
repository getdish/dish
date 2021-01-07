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
  useTheme,
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
  hideScore?: boolean
  hoverable?: boolean
}

const fallbackCard = <CardFrame aspectFixed />

export const RestaurantCard = (props: RestaurantCardProps) => {
  if (!props.restaurantSlug) {
    return fallbackCard
  }
  return (
    <Suspense fallback={fallbackCard}>
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
      hideScore,
      hoverable = true,
      below,
    }: RestaurantCardProps) => {
      const theme = useTheme()
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
          <CardFrame aspectFixed hoverable={hoverable}>
            <VStack
              className="safari-fix-overflow"
              width="100%"
              overflow="hidden"
              alignSelf="center"
              position="relative"
              borderRadius={cardFrameBorderRadius}
              backgroundColor={theme.backgroundColor}
            >
              {/* <AbsoluteVStack
                fullscreen
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                pointerEvents="none"
                transform={[{ scaleX: 0.98 }, { scaleY: 0.98 }]}
                zIndex={10}
                borderRadius={cardFrameBorderRadius - 2}
                shadowColor="#000"
                // shadowRadius={40}
              /> */}
              <AbsoluteVStack
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                pointerEvents="none"
                fullscreen
                zIndex={10}
              >
                <LinearGradient
                  style={StyleSheet.absoluteFill}
                  colors={[`${altColor}00`, `${lightColor}33`, `${altColor}ff`]}
                  start={[1, 0]}
                  end={[0, 1]}
                />
                <LinearGradient
                  style={[StyleSheet.absoluteFill, { opacity: 0.85 }]}
                  colors={[
                    color,
                    color,
                    `${color}99`,
                    `${color}99`,
                    `${color}00`,
                    `${color}00`,
                  ]}
                  start={[1, 0]}
                  end={[0.9, 0.1]}
                />
              </AbsoluteVStack>
              <Image
                resizeMode="cover"
                width={cardFrameWidth}
                height={cardFrameHeight}
                style={{
                  width: cardFrameWidth,
                  height: cardFrameHeight,
                  opacity: 0.5,
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
              {!hideScore && (
                <AbsoluteVStack top={-10} left={-10} zIndex={20}>
                  <RestaurantUpVoteDownVote
                    rounded
                    display="ratio"
                    restaurantSlug={restaurantSlug}
                  />
                </AbsoluteVStack>
              )}

              <VStack
                className="ease-in-out"
                opacity={hideInfo ? 0 : 1}
                padding={15}
                alignItems="flex-start"
                spacing
                width="100%"
                height="100%"
              >
                <HStack width="100%">
                  <VStack minWidth={60} flex={1} />
                  <VStack alignItems="flex-end">
                    <Paragraph
                      textAlign="right"
                      size="xxl"
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
