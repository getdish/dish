import { TopCuisineDish } from '@dish/graph'
import {
  Box,
  HStack,
  LinearGradient,
  StackProps,
  VStack,
  ZStack,
} from '@dish/ui'
import React, { memo, useCallback, useState } from 'react'
import { Image, StyleSheet, Text } from 'react-native'

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
    const borderRadius = 0.3 * size
    const [isHovered, setIsHovered] = useState(false)

    const linkButtonProps: LinkButtonProps = {
      onHoverIn: useCallback(() => setIsHovered(true), []),
      onHoverOut: useCallback(() => setIsHovered(false), []),
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
        alignItems="center"
        position="relative"
        justifyContent="center"
        {...linkButtonProps}
        {...rest}
      >
        <ZStack pointerEvents="none" fullscreen zIndex={10}>
          {!!dish.rating && (
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
            borderWidth={1}
            borderColor="rgba(0,0,0,0.1)"
            pointerEvents="none"
            {...(isHovered && {
              borderColor: 'rgba(0,0,0,0.75)',
              backgroundColor: '#fff',
              shadowRadius: 18,
              shadowColor: 'rgba(0,0,0,0.22)',
              shadowOffset: { width: 0, height: 6 },
              zIndex: 10000,
            })}
          >
            <ZStack fullscreen zIndex={2}>
              <LinearGradient
                colors={[
                  'rgba(0,0,0,0)',
                  'rgba(0,0,0,0.02)',
                  'rgba(0,0,0,0.2)',
                ]}
                style={[StyleSheet.absoluteFill]}
              />
            </ZStack>
            <Image
              source={{ uri: dish.image }}
              style={{ width: size, height: size, backgroundColor: '#eee' }}
              resizeMode="cover"
            />
          </VStack>
        </VStack>
        <HStack
          position="absolute"
          bottom={-20}
          left={-10}
          right={-10}
          padding={6}
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(255,255,255,0.25)"
          borderTopColor="rgba(255,255,255,0.5)"
          borderTopWidth={1}
          shadowColor="rgba(0,0,0,0.05)"
          shadowRadius={3}
          shadowOffset={{ height: -3, width: 0 }}
        >
          <Box
            className="ease-in-out-top"
            backgroundColor="rgba(15,15,15,0.9)"
            paddingVertical={2}
            maxWidth="100%"
            overflow="hidden"
            shadowColor="rgba(0,0,0,0.1)"
            shadowRadius={2}
            top={0}
            {...(isHovered && {
              top: -14,
              backgroundColor: '#fff',
            })}
          >
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                overflow: 'hidden',
                fontSize: 15,
                fontWeight: '700',
                lineHeight: 22,
                color: isHovered ? '#000' : '#fff',
                // opacity: 0.75,
                paddingVertical: 2,
                textAlign: 'center',
              }}
            >
              <Text>{dish.name}</Text>
            </Text>
          </Box>
        </HStack>
      </LinkButton>
    )
  }
)
