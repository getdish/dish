import React, { memo } from 'react'
import { HStack, Text } from 'snackui'

import { blue, green, orange, red } from '../../constants/colors'
import CircularProgress from './CircularProgress'

const sentiments = {
  0: '😞',
  1: '😕',
  2: '🙂',
  3: '😊',
  4: '🤤',
}

const colors = {
  0: red,
  1: orange,
  2: green,
  3: green,
  4: blue,
}

export const SentimentCircle = memo(
  ({ ratio, scale = 1 }: { ratio: number; scale?: number }) => {
    const circleSize = 32 * scale
    const textSize = 25.5 * scale
    const key =
      ratio <= 0.25
        ? 0
        : ratio <= 0.5
        ? 1
        : ratio <= 0.65
        ? 2
        : ratio <= 0.8
        ? 3
        : 4
    return (
      <CircularProgress
        fill={ratio * 100}
        size={circleSize}
        width={5 * scale}
        tintColor={colors[key]}
        lineCap="round"
        backgroundColor="rgba(100,100,100,0.25)"
        rotation={(1 - ratio) * 180}
      >
        <HStack height="100%" alignItems="center" justifyContent="center">
          <Text cursor="default" fontSize={textSize} lineHeight={textSize}>
            {sentiments[key]}
          </Text>
        </HStack>
      </CircularProgress>
    )
  }
)
