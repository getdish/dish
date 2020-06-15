import { TopCuisineDish } from '@dish/graph'
import {
  Box,
  HStack,
  LinearGradient,
  StackProps,
  Text,
  VStack,
  ZStack,
} from '@dish/ui'
import React, { memo, useState } from 'react'
import { Image, StyleSheet } from 'react-native'

import { NavigableTag } from '../../state/Tag'
import { LinkButton } from '../ui/LinkButton'
import { LinkButtonProps } from '../ui/LinkProps'
import { DishRatingView } from './DishRatingView'
import { Squircle } from './Squircle'

export const DishView = memo(
  ({
    dish,
    cuisine,
    size = 100,
    restaurantSlug,
    ...rest
  }: {
    cuisine?: NavigableTag
    dish: TopCuisineDish
    size?: number
    restaurantSlug?: string
  } & StackProps) => {
    const [isHovered, setIsHovered] = useState(false)

    const linkButtonProps: LinkButtonProps = {
      onHoverIn: () => setIsHovered(true),
      onHoverOut: () => setIsHovered(false),
      ...(restaurantSlug
        ? {
            name: 'gallery',
            params: {
              restaurantSlug,
              dishId: dish.id,
            },
          }
        : {
            tags: [
              cuisine,
              { type: 'dish', name: dish.name },
            ] as NavigableTag[],
          }),
    }

    return (
      <LinkButton
        className="ease-in-out"
        alignItems="center"
        position="relative"
        justifyContent="center"
        pressStyle={{
          transform: [{ scale: 0.98 }],
          opacity: 1,
        }}
        hoverStyle={{
          transform: [{ scale: 1.03 }],
        }}
        {...linkButtonProps}
        {...rest}
      >
        {/* rating */}
        <ZStack pointerEvents="none" fullscreen zIndex={10}>
          {!!dish.rating && (
            <DishRatingView
              size={size > 170 ? 'sm' : 'xs'}
              dish={dish}
              position="absolute"
              top={2}
              right={-6}
            />
          )}
        </ZStack>
        <Squircle
          size={size}
          isHovered={isHovered}
          {...(dish.isFallback && {
            opacity: 0.8,
          })}
        >
          {!!dish.image && (
            <Image
              source={{ uri: dish.image }}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode="cover"
            />
          )}
          {!dish.image && <Text fontSize={80}>🥗</Text>}
        </Squircle>
        <HStack
          position="absolute"
          bottom={-15}
          overflow="hidden"
          width="calc(100% + 30px)"
          marginHorizontal={-15}
          height={55}
        >
          <HStack
            position="absolute"
            bottom={0}
            left={-16}
            right={-16}
            padding={6}
            alignItems="center"
            justifyContent="center"
            backgroundColor="rgba(255,255,255,0.32)"
            borderTopColor="rgba(255,255,255,0.5)"
            borderTopWidth={1}
            shadowColor="rgba(0,0,0,0.05)"
            shadowRadius={8}
            shadowOffset={{ height: -3, width: 0 }}
            {...(isHovered && {
              backgroundColor: 'transparent',
            })}
          >
            <Box
              position="relative"
              className="ease-in-out-top"
              backgroundColor="rgba(0,0,0,0.7)"
              borderRadius={80}
              paddingVertical={4}
              paddingHorizontal={10}
              maxWidth="100%"
              overflow="hidden"
              shadowColor="rgba(0,0,0,0.08)"
              shadowRadius={4}
              top={0}
              {...(isHovered && {
                top: -14,
                backgroundColor: '#fff',
              })}
            >
              <Text
                ellipse
                flex={1}
                overflow="hidden"
                fontSize={14}
                fontWeight="400"
                color={isHovered ? '#000' : '#fff'}
                textAlign="center"
              >
                {dish.name}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </LinkButton>
    )
  }
)
