import { graphql } from '@dish/graph'
import React, { Suspense, memo, useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import { AbsoluteVStack, LinearGradient, Paragraph, VStack } from 'snackui'

import { getColorsForName } from '../../helpers/getColorsForName'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Link } from '../../views/ui/Link'
import {
  CardFrame,
  cardFrameHeight,
  cardFrameWidth,
  cardnFrameBorderRadiusSmaller,
} from './CardFrame'
import { ratingToRatio } from './ratingToRatio'
import { priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'

export type RestaurantCardProps = {
  size?: 'lg' | 'md'
  restaurantSlug: string
  restaurantId: string
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
    ({ size = 'lg', restaurantSlug, restaurantId }: RestaurantCardProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const scale = size === 'lg' ? 1.2 : 1
      const [hideInfo, setHideInfo] = useState(false)
      const [price_label, price_color, price_range] = priceRange(restaurant)
      const { lightColor, color, altColor } = getColorsForName(restaurant.name)

      const handleOnIsAtStart = useCallback((x) => {
        setHideInfo(!x)
      }, [])

      return (
        <Link name="restaurant" params={{ slug: restaurantSlug }}>
          <CardFrame hoverable>
            <VStack
              backgroundColor={color}
              borderRadius={cardnFrameBorderRadiusSmaller}
            >
              <VStack
                className="safari-fix-overflow"
                width="100%"
                overflow="hidden"
                alignSelf="center"
                position="relative"
                borderRadius={cardnFrameBorderRadiusSmaller}
              >
                <AbsoluteVStack
                  fullscreen
                  className="ease-in-out"
                  opacity={hideInfo ? 0 : 1}
                  pointerEvents="none"
                  transform={[{ scaleX: 0.98 }, { scaleY: 0.98 }]}
                  zIndex={10}
                  borderRadius={cardnFrameBorderRadiusSmaller - 2}
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
                  {/* <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={[
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.1)',
                      'rgba(0,0,0,0.4)',
                    ]}
                  /> */}
                  <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={[`${lightColor}22`, `${color}99`]}
                    start={[0, 0]}
                    end={[0.4, 0.4]}
                  />
                  <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={[`${altColor}22`, `${altColor}99`]}
                    start={[1, 1]}
                    end={[0.6, 0.6]}
                  />
                </AbsoluteVStack>
                <RestaurantPhotosRow
                  onIsAtStart={handleOnIsAtStart}
                  restaurantSlug={restaurantSlug}
                  width={cardFrameWidth}
                  height={cardFrameHeight}
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
                    activeTags={{}}
                    restaurantSlug={restaurantSlug}
                    restaurantId={restaurantId}
                    score={restaurant.score ?? 0}
                    ratio={ratingToRatio(restaurant.rating ?? 1)}
                  />
                </AbsoluteVStack>

                <VStack
                  className="ease-in-out"
                  opacity={hideInfo ? 0 : 1}
                  padding={20}
                  alignItems="flex-start"
                  spacing
                >
                  <Paragraph size={1.1} color="#fff" fontWeight="800">
                    {restaurant.name}
                  </Paragraph>
                  <Paragraph color="#fff" fontWeight="500">
                    {price_range}
                  </Paragraph>
                </VStack>

                <VStack marginVertical={-18}>
                  <RestaurantFavoriteButton
                    size="md"
                    restaurantId={restaurantId}
                  />
                </VStack>
              </AbsoluteVStack>
            </VStack>
          </CardFrame>
        </Link>
      )
    }
  )
)
