import { graphql } from '@dish/graph'
import { rest } from 'lodash'
import React, { Suspense, memo, useCallback, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  LinearGradient,
  Paragraph,
  StackProps,
  VStack,
} from 'snackui'

import { bgLight, brandColorLight, lightYellow, yellow } from '../../colors'
import { getColorsForName } from '../../helpers/getColorsForName'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { RestaurantUpVoteDownVote } from '../../views/restaurant/RestaurantUpVoteDownVote'
import { Link } from '../../views/ui/Link'
import { CardFrame, borderRadiusSmaller, height, width } from './CardFrame'
import { ratingToRatio } from './ratingToRatio'
import { priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'
import RestaurantRatingView from './RestaurantRatingView'

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
    ({ size = 'md', restaurantSlug, restaurantId }: RestaurantCardProps) => {
      const restaurant = useRestaurantQuery(restaurantSlug)
      const scale = size === 'lg' ? 1.2 : 1
      const [hideInfo, setHideInfo] = useState(false)
      const [price_label, price_color, price_range] = priceRange(restaurant)
      const { lightColor, color } = getColorsForName(restaurant.name)

      const handleOnIsAtStart = useCallback((x) => {
        setHideInfo(!x)
      }, [])

      return (
        <Link name="restaurant" params={{ slug: restaurantSlug }}>
          <CardFrame hoverable>
            <VStack backgroundColor={color} borderRadius={borderRadiusSmaller}>
              <VStack
                className="safari-overflow-fix"
                width="100%"
                overflow="hidden"
                alignSelf="center"
                position="relative"
                borderRadius={borderRadiusSmaller}
              >
                <AbsoluteVStack
                  className="ease-in-out"
                  opacity={hideInfo ? 0 : 1}
                  pointerEvents="none"
                  fullscreen
                  zIndex={10}
                >
                  <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={[
                      'rgba(0,0,0,0)',
                      'rgba(0,0,0,0.1)',
                      'rgba(0,0,0,0.4)',
                    ]}
                  />
                  <LinearGradient
                    style={StyleSheet.absoluteFill}
                    colors={[`${lightColor}22`, `${color}99`]}
                  />
                </AbsoluteVStack>
                {/* <VStack opacity={0.5} className="filter-image"> */}
                <RestaurantPhotosRow
                  onIsAtStart={handleOnIsAtStart}
                  restaurantSlug={restaurantSlug}
                  width={width}
                  height={height}
                />
                {/* </VStack> */}
              </VStack>
              <AbsoluteVStack
                alignItems="flex-end"
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
                  alignItems="flex-end"
                  spacing
                >
                  <Paragraph size={1.1} color="#fff" fontWeight="800">
                    {restaurant.name}
                  </Paragraph>
                  <Paragraph color="#fff" fontWeight="500">
                    {price_range}
                  </Paragraph>
                </VStack>

                <CircleButton
                  zIndex={10}
                  alignSelf="center"
                  marginVertical={-18}
                >
                  <Suspense fallback={null}>
                    <RestaurantFavoriteButton
                      restaurantId={restaurantId}
                      size="md"
                    />
                  </Suspense>
                </CircleButton>
              </AbsoluteVStack>
            </VStack>
          </CardFrame>
        </Link>
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
