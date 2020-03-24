import React, { forwardRef } from 'react'
import { Text } from 'react-native'
import { Restaurant } from '@dish/models'
import { VStack } from '../shared/Stacks'

export const RatingView = forwardRef(
  ({ restaurant }: { restaurant: Restaurant }, ref) => {
    const rank = Math.round(restaurant.rating * 20)
    const color = rank > 84 ? 'green' : rank > 60 ? 'orange' : 'red'
    return (
      <VStack ref={ref as any} position="relative">
        {rank > 89 && (
          <VStack
            position="absolute"
            top={-5}
            // bottom={0}
            right={-5}
            alignItems="center"
            justifyContent="center"
            zIndex={100}
          >
            <Text
              style={{
                fontSize: 20,
                textShadowColor: 'rgba(0,0,0,0.5)',
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
          width={58}
          height={58}
          alignItems="center"
          justifyContent="center"
          padding={3}
        >
          <VStack
            borderRadius={100}
            backgroundColor={color}
            padding={1}
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
              <Text style={{ fontSize: 22, fontWeight: '600', color }}>
                {rank}
              </Text>
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    )
  }
)
