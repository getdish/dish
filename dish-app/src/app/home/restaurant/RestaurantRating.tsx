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
  const fontSize = 18 * (size === 'md' ? 1.2 : 1)
  const ratingNormal = Math.min(10, Math.max(0, rating))
  return (
    <Circle
      backgroundColor={
        colors
          ? darken
            ? colors.darkColor
            : lighten
            ? colors.lightColor
            : colors.color
          : '#000'
      }
      // shadowColor="#000"
      // shadowOffset={{ height: 2, width: 0 }}
      // shadowOpacity={0.1}
      // shadowRadius={10}
      size={size === 'sm' ? 30 : 46}
      position="relative"
      transform={[
        {
          scale: ratingScales[ratingNormal],
        },
      ]}
    >
      <Text
        zIndex={10}
        color={lighten ? colors?.darkColor : '#fff'}
        fontWeight={ratingNormal >= 8 ? '900' : '700'}
        fontSize={fontSize}
        opacity={ratingNormal >= 5 ? 1 : 0.65}
      >
        {ratingNormal}
      </Text>
    </Circle>
  )
}

const ratingScales = {
  0: 0.8,
  1: 0.8,
  2: 0.8,
  3: 0.8,
  4: 0.8,
  5: 0.85,
  6: 0.85,
  7: 0.95,
  8: 1,
  9: 1.05,
  10: 1.1,
}

// const sheet = StyleSheet.create({
//   gradient: {
//     zIndex: 0,
//     opacity: 0.7,
//   },
// })
