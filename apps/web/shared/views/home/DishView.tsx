import { TopCuisineDish } from '@dish/graph'
import {
  Box,
  HStack,
  LinearGradient,
  Popover,
  StackProps,
  Text,
  VStack,
  ZStack,
} from '@dish/ui'
import { memo, useCallback, useState } from 'react'
import React from 'react'
import { Image, StyleSheet } from 'react-native'

import { NavigableTag } from '../../state/Tag'
import { LinkButton, LinkButtonProps } from '../ui/LinkButton'
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
        className="ease-in-out-fast"
        alignItems="center"
        position="relative"
        justifyContent="center"
        pressStyle={{
          transform: [{ scale: 1.02 }],
          opacity: 0.8,
        }}
        hoverStyle={{
          transform: [{ scale: 1.01 }],
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
          shadowColor="rgba(0,0,0,0.1)"
          shadowRadius={20}
          shadowOffset={{ width: 0, height: 10 }}
          borderRadius={borderRadius}
        >
          {/* frame (inner) */}
          <VStack
            className="ease-in-out-fast"
            shadowColor="rgba(0,0,0,0.112)"
            shadowRadius={14}
            shadowOffset={{ width: 0, height: 4 }}
            width="100%"
            height="100%"
            borderRadius={borderRadius}
            overflow="hidden"
            borderWidth={20}
            borderColor="yellow"
            alignItems="center"
            justifyContent="center"
            {...(dish.isFallback && {
              opacity: 0.8,
            })}
            pointerEvents="none"
            {...(isHovered && {
              borderColor: 'rgba(0,0,0,0.75)',
              backgroundColor: '#fff',
              shadowRadius: 18,
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
                isHovered
                  ? 'ease-in-out inner-glow'
                  : 'ease-in-out inner-shadow'
              }
              borderRadius={borderRadius}
              overflow="hidden"
              fullscreen
              zIndex={2}
            >
              <LinearGradient
                colors={[
                  'rgba(255,255,255,0.6)',
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
                  width: size + 30,
                  height: size + 30,
                  marginTop: -15,
                  marginLeft: -15,
                  backgroundColor: '#000',
                }}
                resizeMode="cover"
              />
            )}
            {!dish.image && <Text fontSize={100}>🍔</Text>}
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
              borderRadius={10}
              paddingVertical={0}
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
                lineHeight={22}
                color={isHovered ? '#000' : '#fff'}
                paddingVertical={2}
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
