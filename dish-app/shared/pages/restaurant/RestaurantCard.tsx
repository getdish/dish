import { graphql } from '@dish/graph'
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
import { priceRange } from './RestaurantDetailRow'
import { RestaurantFavoriteButton } from './RestaurantFavoriteButton'
import { RestaurantPhotosRow } from './RestaurantPhotosRow'
import RestaurantRatingView from './RestaurantRatingView'

type RestaurantCardProps = {
  size?: 'lg' | 'md'
  restaurantSlug: string
  restaurantId: string
}

export const RestaurantCard = (props: RestaurantCardProps) => {
  return (
    <Suspense fallback={<CardFrame />}>
      <RestaurantCardContent {...props} />
    </Suspense>
  )
}

const width = 260
const height = 360
const borderRadius = 12
const borderRadiusSmaller = 10

const CardFrame = (props: any) => {
  return (
    <VStack
      borderRadius={borderRadius}
      width={width}
      height={height}
      backgroundColor="#fff"
      shadowColor="#000"
      shadowOpacity={0.1}
      shadowRadius={5}
      shadowOffset={{ height: 2, width: 0 }}
      borderWidth={3}
      borderColor="#fff"
      position="relative"
      {...props}
    />
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

      console.log('lightColor', lightColor, color)

      const handleOnIsAtStart = useCallback((x) => {
        setHideInfo(!x)
      }, [])

      return (
        <CardFrame>
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
                  colors={[`${lightColor}99`, `${color}99`]}
                />
              </AbsoluteVStack>
              <VStack opacity={0.5} className="filter-image">
                <RestaurantPhotosRow
                  onIsAtStart={handleOnIsAtStart}
                  restaurantSlug={restaurantSlug}
                  width={width}
                  height={height}
                />
              </VStack>
            </VStack>
            <AbsoluteVStack
              alignItems="flex-end"
              fullscreen
              justifyContent="flex-end"
              pointerEvents="none"
              zIndex={10}
            >
              <AbsoluteVStack top={-10} left={-10} zIndex={20}>
                <RestaurantRatingView
                  size="lg"
                  restaurantSlug={restaurantSlug}
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

              <CircleButton zIndex={10} alignSelf="center" marginVertical={-18}>
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
