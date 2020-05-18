import { TopCuisineDish } from '@dish/graph'
import React, { memo } from 'react'
import { Image, StyleSheet, Text } from 'react-native'

import { Tag } from '../../state/Tag'
import { Box } from '../ui/Box'
import { LinearGradient } from '../ui/LinearGradient'
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
    const borderRadius = 0.3 * size
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
              size={size > 170 ? 'md' : 'sm'}
              dish={dish}
              position="absolute"
              top={2}
              right={-6}
            />
          )}
        </ZStack>
        <VStack
          width={size}
          height={size}
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={20}
          shadowOffset={{ width: 0, height: 10 }}
          borderRadius={borderRadius}
        >
          <VStack
            className="ease-in-out-fast"
            shadowColor="rgba(0,0,0,0.112)"
            shadowRadius={14}
            shadowOffset={{ width: 0, height: 4 }}
            width="100%"
            height="100%"
            borderRadius={borderRadius}
            overflow="hidden"
            borderWidth={2}
            borderColor="rgba(0,0,0,0.1)"
            hoverStyle={{
              borderColor: 'rgba(0,0,0,0.6)',
              shadowRadius: 14,
              shadowColor: 'rgba(0,0,0,0.2)',
              zIndex: 10000,
            }}
          >
            <ZStack fullscreen zIndex={2}>
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.025)',
                  'rgba(0,0,0,0.2)',
                ]}
                style={[StyleSheet.absoluteFill]}
              />
            </ZStack>
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
                fontSize: 15,
                fontWeight: '600',
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
