import { Restaurant } from '@dish/models'
import React, { forwardRef } from 'react'
import { Text } from 'react-native'

import { ProgressCircle } from '../ui/ProgressCircle'
import { StackBaseProps, VStack } from '../ui/Stacks'

export type RatingViewProps = StackBaseProps & {
  size: 'lg' | 'md' | 'sm'
  percent: number
  color: string
  hideEmoji?: boolean
}

export const getRestaurantRating = (restaurant: Partial<Restaurant>) =>
  Math.round(restaurant.rating * 20)

export const getRankingColor = (percent: number) =>
  percent > 84 ? 'green' : percent > 60 ? 'orange' : 'red'

export const RatingView = forwardRef(
  (
    { color, percent, size: sizeIn, hideEmoji, ...rest }: RatingViewProps,
    ref
  ) => {
    const borderColor =
      percent > 84 ? 'lightgreen' : percent > 60 ? 'gold' : 'red'
    const size = sizeIn == 'sm' ? 38 : sizeIn == 'md' ? 48 : 72
    return (
      <VStack
        ref={ref as any}
        position="relative"
        width={size}
        height={size}
        {...rest}
      >
        {!hideEmoji && percent >= 80 && (
          <VStack
            position="absolute"
            top={-2 + (sizeIn == 'lg' ? 0 : -4)}
            right={-2 + (sizeIn == 'lg' ? 0 : -4)}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            <Text
              style={{
                fontSize: Math.max(14, size * 0.3),
                textShadowColor: 'rgba(0,0,0,0.25)',
                textShadowRadius: size * 0.015,
              }}
            >
              {percent >= 90 ? '🏆' : '⭐️'}
            </Text>
          </VStack>
        )}
        <VStack
          backgroundColor="#fff"
          borderRadius={100}
          shadowColor={`rgba(0,0,0,${sizeIn == 'lg' ? 0.15 : 0.2})`}
          shadowRadius={size / 10}
          shadowOffset={{ height: 1, width: 0 }}
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
          // padding={3 + (sizeIn == 'lg' ? 1 : 0)}
        >
          <ProgressCircle
            percent={percent}
            radius={size * 0.4522}
            borderWidth={size * 0.06}
            color={borderColor}
          >
            <VStack
              width="100%"
              height="100%"
              borderRadius={100}
              backgroundColor="#fff"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                style={{
                  fontSize: size * 0.38,
                  fontWeight: '600',
                  color,
                  letterSpacing: -(size / 35),
                }}
              >
                {percent}
              </Text>
            </VStack>
          </ProgressCircle>
          <VStack
            borderRadius={100}
            borderColor={borderColor}
            borderWidth={1 + (sizeIn == 'lg' ? 1 : 0)}
            width="100%"
            height="100%"
            position="absolute"
          ></VStack>
        </VStack>
      </VStack>
    )
  }
)
