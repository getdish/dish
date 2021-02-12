import React from 'react'
import { Circle, Text } from 'snackui'

import { ColorShades } from '../../../helpers/getColorsForName'

export const RestaurantRating = ({
  size,
  darken,
  colors,
  rating,
  lighten,
}: {
  size?: 'sm' | 'md'
  rating: number
  darken?: boolean
  colors?: ColorShades
  lighten?: boolean
}) => {
  const fontSize = 15 * (size === 'md' ? 1.2 : 1)
  const ratingNormal = Math.min(10, Math.max(0, rating))
  return (
    <Circle
      backgroundColor={
        colors
          ? darken
            ? colors.darkColor
            : lighten
            ? colors.extraLightColor
            : colors.color
          : '#000'
      }
      // shadowColor="#000"
      // shadowOffset={{ height: 2, width: 0 }}
      // shadowOpacity={0.1}
      // shadowRadius={10}
      size={size === 'sm' ? 28 : 46}
      position="relative"
    >
      <Text
        zIndex={10}
        color={lighten ? colors?.darkColor : '#fff'}
        fontWeight="600"
        letterSpacing={-1}
        fontSize={fontSize}
        opacity={ratingNormal >= 5 ? 1 : 0.65}
      >
        {ratingNormal}
      </Text>
    </Circle>
  )
}

// const sheet = StyleSheet.create({
//   gradient: {
//     zIndex: 0,
//     opacity: 0.7,
//   },
// })
