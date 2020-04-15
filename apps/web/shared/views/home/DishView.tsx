import { Dish } from '@dish/models'
import React, { memo } from 'react'
import { Image, Text } from 'react-native'

import { LinkButton } from '../ui/Link'
import { VStack, ZStack } from '../ui/Stacks'
import { DishRatingView } from './DishRatingView'

export const DishView = memo(
  ({ dish, size = 100 }: { dish: Dish; size?: number }) => {
    return (
      <LinkButton
        alignItems="center"
        position="relative"
        justifyContent="center"
        name="search"
        params={{
          dish: dish.name,
        }}
      >
        <ZStack fullscreen zIndex={10}>
          <DishRatingView
            size="sm"
            dish={dish}
            position="absolute"
            top={-4}
            right={-12}
          />
        </ZStack>
        <VStack width={size} height={size}>
          <VStack
            className="ease-in-out"
            shadowColor="rgba(0,0,0,0.17)"
            shadowRadius={5}
            shadowOffset={{ width: 0, height: 0 }}
            width="100%"
            height="100%"
            borderRadius={17}
            overflow="hidden"
            hoverStyle={{
              shadowRadius: 35,
              shadowColor: 'rgba(0,0,0,0.35)',
              zIndex: 10000,
            }}
          >
            <Image
              source={{ uri: dish.image }}
              style={{ width: size, height: size }}
              resizeMode="cover"
            />
          </VStack>
        </VStack>
        <VStack
          marginTop={3}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
        >
          <Text
            numberOfLines={1}
            style={{
              fontWeight: '600',
              fontSize: 13,
              lineHeight: 22,
              opacity: 0.75,
              textAlign: 'center',
            }}
          >
            {dish.name}
          </Text>
        </VStack>
      </LinkButton>
    )
  }
)
