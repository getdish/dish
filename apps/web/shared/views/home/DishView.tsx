import { TopCuisineDish } from '@dish/graph'
import React, { memo } from 'react'
import { Image, Text } from 'react-native'

import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { LinkButton } from '../ui/Link'
import { HStack, StackProps, VStack, ZStack } from '../ui/Stacks'
import { bg } from './colors'
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
              top={2}
              right={-6}
            />
          )}
        </ZStack>
        <VStack width={size} height={size}>
          <VStack
            className="ease-in-out"
            shadowColor="rgba(0,0,0,0.12)"
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 4 }}
            width="100%"
            height="100%"
            borderRadius={0.36 * size}
            overflow="hidden"
            borderWidth={2}
            borderColor="transparent"
            hoverStyle={{
              borderColor: bg,
              shadowRadius: 14,
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
        <HStack
          position="absolute"
          bottom={-26}
          left={0}
          right={0}
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          padding={15}
        >
          <Box paddingVertical={2} maxWidth="100%" overflow="hidden">
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                overflow: 'hidden',
                fontSize: 13,
                fontWeight: '700',
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
        </HStack>
      </LinkButton>
    )
  }
)
