import React from 'react'
import { Circle, Text } from 'snackui'

import { ColorShades } from '../../../helpers/getColorsForName'

export const RestaurantRating = ({
  size,
  darken,
  colors,
  rating,
}: {
  size?: 'sm' | 'md'
  rating: number
  darken?: boolean
  colors: ColorShades
}) => {
  const fontSize = 20 * (size === 'md' ? 1.2 : 1)
  const ratingNormal = Math.min(10, Math.max(0, rating))
  return (
    <Circle
      backgroundColor={darken ? '#000' : colors.color}
      shadowColor="#000"
      shadowOffset={{ height: 2, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={10}
      size={size === 'sm' ? 34 : 48}
      position="relative"
      transform={[
        {
          scale: ratingScales[ratingNormal],
        },
      ]}
    >
      <Text
        zIndex={10}
        color="#fff"
        fontWeight={ratingNormal >= 8 ? '900' : '700'}
        fontSize={fontSize}
      >
        {ratingNormal}
      </Text>
    </Circle>
  )
}

const ratingScales = {
  0: 0.65,
  1: 0.65,
  2: 0.65,
  3: 0.65,
  4: 0.75,
  5: 0.8,
  6: 0.8,
  7: 0.9,
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
