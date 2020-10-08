import { Text, TextProps } from '@dish/ui'
import React from 'react'

export const PointsText = ({
  points,
  ...props
}: Omit<TextProps, 'children'> & { points: number }) => {
  return (
    <Text color={points > 0 ? 'green' : points < 0 ? 'red' : '#888'} {...props}>
      <Text fontSize={10} transform={[{ translateY: -2 }]}>
        {points > 0 ? '+' : ''}
      </Text>
      {Math.round(points)}
    </Text>
  )
}
