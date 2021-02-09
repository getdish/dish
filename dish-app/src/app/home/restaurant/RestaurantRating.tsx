import React from 'react'
import { Circle, Text } from 'snackui'

import { ColorShades } from '../../../helpers/getColorsForName'

export const RestaurantRating = ({
  size,
  colors,
  rating,
}: {
  size?: 'sm' | 'md'
  rating: number
  colors: ColorShades
}) => {
  const fontSize = rating > 7 ? 20 : 16 * (size === 'md' ? 1.2 : 1)
  return (
    <Circle
      backgroundColor={colors.darkColor}
      shadowColor="#000"
      shadowOffset={{ height: 2, width: 0 }}
      shadowOpacity={0.1}
      shadowRadius={10}
      size={size === 'sm' ? 36 : 42}
    >
      <Text color="#fff" fontWeight="800" fontSize={fontSize}>
        {rating}
      </Text>
    </Circle>
  )
}
