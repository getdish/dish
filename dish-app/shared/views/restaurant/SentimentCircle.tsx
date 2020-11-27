import React, { memo } from 'react'
import { HStack, Text } from 'snackui'

import { blue, green, orange, red } from '../../colors'
import CircularProgress from '../CircularProgress'

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
  2: orange,
  3: green,
  4: blue,
}

export const SentimentCircle = memo(({ ratio }: { ratio: number }) => {
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
      size={28}
      width={4}
      tintColor={colors[key]}
      lineCap="round"
      backgroundColor="#fff"
      rotation={(1 - ratio) * 180}
    >
      {() => (
        <HStack>
          <Text fontSize={26} color={green} fontWeight="900">
            {sentiments[key]}
          </Text>
        </HStack>
      )}
    </CircularProgress>
  )
})
