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
    const borderRadius = 40
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
        {/* frame (shadow) */}
        <VStack
          width={size}
          height={size}
          shadowColor="rgba(0,0,0,0.032)"
          shadowRadius={20}
          shadowOffset={{ width: 0, height: 20 }}
          borderRadius={borderRadius}
        >
          {/* frame (inner) */}
          <VStack
            className="ease-in-out-fast"
            shadowColor="rgba(0,0,0,0.112)"
            shadowRadius={14}
            shadowOffset={{ width: 0, height: 4 }}
            flex={1}
            borderRadius={borderRadius}
            overflow="hidden"
            alignItems="center"
            justifyContent="center"
            {...(dish.isFallback && {
              opacity: 0.8,
            })}
            pointerEvents="none"
            {...(isHovered && {
              borderColor: 'rgba(0,0,0,0.75)',
              backgroundColor: '#fff',
              shadowRadius: 13,
              shadowColor: 'rgba(0,0,0,0.25)',
              shadowOffset: { width: 0, height: 6 },
              zIndex: 10000,
            })}
          >
            {/* <ZStack position="absolute" zIndex={3} bottom={-10} right={-10}>
              <Text fontSize={50} color="red">
                ♥️
              </Text>
            </ZStack> */}
            <ZStack
              className={
                // isHovered
                // 'ease-in-out inner-glow'
                'ease-in-out inner-shadow'
              }
              borderRadius={borderRadius}
              overflow="hidden"
              fullscreen
              zIndex={2}
            >
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.45)',
                  'rgba(255,255,255,0)',
                  'rgba(255,255,255,0)',
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.2)',
                ]}
                style={[StyleSheet.absoluteFill]}
              />
            </ZStack>
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
          </VStack>
        </VStack>

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
              backgroundColor="rgba(0,0,0,0.85)"
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
                fontWeight="600"
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
