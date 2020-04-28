import { TopCuisineDish } from '@dish/models'
import React, { memo } from 'react'
import { Image, Text } from 'react-native'

import { LinkButton } from '../ui/Link'
import { StackProps, VStack, ZStack } from '../ui/Stacks'
import { DishRatingView } from './DishRatingView'

export const DishView = memo(
  ({
    dish,
    size = 100,
    ...rest
  }: { dish: TopCuisineDish; size?: number } & StackProps) => {
    return (
      <LinkButton
        alignItems="center"
        position="relative"
        justifyContent="center"
        tag={{ type: 'dish', name: dish.name }}
        {...rest}
      >
        <ZStack pointerEvents="none" fullscreen zIndex={10}>
          <DishRatingView
            size={size > 150 ? 'sm' : 'xs'}
            dish={dish}
            position="absolute"
            top={-4}
            right={-12}
          />
        </ZStack>
        <VStack width={size} height={size}>
          <VStack
            className="ease-in-out"
            shadowColor="rgba(0,0,0,0.25)"
            shadowRadius={6}
            shadowOffset={{ width: 0, height: 2 }}
            width="100%"
            height="100%"
            borderRadius={0.15 * size}
            overflow="hidden"
            hoverStyle={{
              shadowRadius: 35,
              shadowColor: 'rgba(0,0,0,0.2)',
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
            numberOfLines={2}
            style={{
              fontSize: 13,
              fontWeight: '500',
              lineHeight: 22,
              // opacity: 0.75,
              paddingVertical: 2,
              textAlign: 'center',
            }}
          >
            <Text>{dish.name}</Text>
            {/* <Text style={{ fontSize: 12 }}>
              {'\n'} {dish.count} restaurants
            </Text> */}
          </Text>
        </VStack>
      </LinkButton>
    )
  }
)
