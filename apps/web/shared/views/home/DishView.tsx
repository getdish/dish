import { TopCuisineDish } from '@dish/models'
import React, { memo } from 'react'
import { Image, Text } from 'react-native'

import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { LinkButton } from '../ui/Link'
import { StackProps, VStack, ZStack } from '../ui/Stacks'
import { DishRatingView } from './DishRatingView'

export const DishView = memo(
  ({
    dish,
    cuisine,
    size = 100,
    ...rest
  }: { cuisine?: Tag; dish: TopCuisineDish; size?: number } & StackProps) => {
    return (
      <LinkButton
        alignItems="center"
        position="relative"
        justifyContent="center"
        tags={[cuisine, { type: 'dish', name: dish.name }]}
        {...rest}
      >
        <ZStack pointerEvents="none" fullscreen zIndex={10}>
          {dish.rating && (
            <DishRatingView
              size={size > 150 ? 'sm' : 'xs'}
              dish={dish}
              position="absolute"
              top={-4}
              right={-12}
            />
          )}
        </ZStack>
        <VStack width={size} height={size}>
          <VStack
            className="ease-in-out"
            shadowColor="rgba(0,0,0,0.12)"
            shadowRadius={12}
            shadowOffset={{ width: 0, height: 4 }}
            width="100%"
            height="100%"
            borderRadius={0.15 * size}
            overflow="hidden"
            hoverStyle={{
              shadowRadius: 11,
              shadowColor: 'rgba(0,0,0,0.45)',
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
        <VStack marginTop={-16} alignItems="center" justifyContent="center">
          <Box paddingVertical={2}>
            <Text
              numberOfLines={1}
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
          </Box>
        </VStack>
      </LinkButton>
    )
  }
)
