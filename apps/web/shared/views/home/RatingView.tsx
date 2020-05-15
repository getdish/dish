import React, { forwardRef } from 'react'
import { Text } from 'react-native'

import { ProgressCircle } from '../ui/ProgressCircle'
import { StackProps, VStack } from '../ui/Stacks'

export type RatingViewProps = StackProps & {
  size: 'lg' | 'md' | 'sm' | 'xs'
  percent: number
  color: string
  hideEmoji?: boolean
}

export const getRankingColor = (percent: number) =>
  percent >= 8 ? '#00BA00' : percent >= 5 ? 'rgba()' : 'red'

export const RatingView = forwardRef(
  (
    { color, percent, size: sizeIn, hideEmoji, ...rest }: RatingViewProps,
    ref
  ) => {
    if (isNaN(percent)) {
      percent = 0
    }
    const borderColor =
      percent >= 8
        ? 'rgba(190, 250, 200, 0.5)'
        : percent >= 5
        ? 'gold'
        : 'rgba(250, 100, 100, 0.5)'

    // size!
    const size =
      sizeIn == 'xs' ? 32 : sizeIn === 'sm' ? 40 : sizeIn == 'md' ? 48 : 76

    const badgeOffset =
      sizeIn === 'xs' || sizeIn === 'sm' ? Math.max(-size * 0.005) : 0

    return (
      <VStack
        ref={ref as any}
        position="relative"
        width={size}
        height={size}
        {...rest}
      >
        {!hideEmoji && percent >= 7 && (
          <VStack
            position="absolute"
            top={badgeOffset * size}
            right={badgeOffset * size}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            <Text
              style={{
                fontSize: Math.max(12, size * 0.25),
                textShadowColor: 'rgba(0,0,0,0.25)',
                textShadowRadius: size * 0.015,
              }}
            >
              {percent >= 9 ? '💎' : '⭐️'}
            </Text>
          </VStack>
        )}
        <VStack
          backgroundColor="#fff"
          borderRadius={100}
          shadowColor={`rgba(0,0,0,${sizeIn == 'lg' ? 0.05 : 0.1})`}
          shadowRadius={size / 10}
          shadowOffset={{ height: 3, width: 0 }}
          width={size}
          height={size}
          alignItems="center"
          // justifyContent="center"
        >
          <ProgressCircle
            percent={percent}
            radius={size * 0.5}
            borderWidth={size * 0.07}
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
                  fontSize: Math.max(13, size * 0.48),
                  fontWeight: '700',
                  color,
                  letterSpacing: -(size / 90),
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
