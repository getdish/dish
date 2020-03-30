import { Restaurant } from '@dish/models'
import React, { forwardRef } from 'react'
import { Text } from 'react-native'

import { VStack } from '../shared/Stacks'

export const RatingView = forwardRef(
  (
    { restaurant, size: sizeIn }: { size: 'lg' | 'md'; restaurant: Restaurant },
    ref
  ) => {
    const rank = Math.round(restaurant.rating * 20)
    const color = rank > 84 ? 'green' : rank > 60 ? 'orange' : 'red'
    const borderColor =
      rank > 84 ? 'lightgreen' : rank > 60 ? 'sunset' : 'lightred'
    const size = sizeIn == 'md' ? 54 : 72
    return (
      <VStack ref={ref as any} position="relative">
        {rank > 89 && (
          <VStack
            position="absolute"
            top={-6}
            // bottom={0}
            right={-6}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            <Text
              style={{
                fontSize: 18 + (sizeIn == 'lg' ? 6 : 0),
                textShadowColor: 'rgba(0,0,0,0.25)',
                textShadowRadius: 2,
              }}
            >
              ⭐️
            </Text>
          </VStack>
        )}
        <VStack
          backgroundColor="#fff"
          borderRadius={100}
          shadowColor="rgba(0,0,0,0.25)"
          shadowRadius={8}
          shadowOffset={{ height: 1, width: 0 }}
          width={size}
          height={size}
          alignItems="center"
          justifyContent="center"
          padding={3 + (sizeIn == 'lg' ? 1 : 0)}
        >
          <VStack
            borderRadius={100}
            borderColor={borderColor}
            borderWidth={1 + (sizeIn == 'lg' ? 1 : 0)}
            width="100%"
            height="100%"
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
                  fontSize: 22 + (sizeIn == 'lg' ? 4 : 0),
                  fontWeight: '600',
                  color,
                  letterSpacing: -2,
                }}
              >
                {rank}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    )
  }
)
