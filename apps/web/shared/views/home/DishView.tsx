import { TopCuisineDish } from '@dish/graph'
import { AbsoluteVStack, Box, HStack, StackProps, Text } from '@dish/ui'
import { capitalize } from 'lodash'
import React, { memo, useState } from 'react'
import { Image } from 'react-native'

import { IMAGE_PROXY_DOMAIN } from '../../constants'
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

    const width = size * 0.8
    const height = size
    const quality = size > 160 ? 80 : 60
    const imageUrl = `${IMAGE_PROXY_DOMAIN}/${width}x${height},q${quality}/${dish.image}`

    return (
      <LinkButton
        className="ease-in-out-fast"
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
        <AbsoluteVStack pointerEvents="none" fullscreen zIndex={10}>
          {!!dish.rating && (
            <DishRatingView
              size={size > 220 ? 'sm' : 'xs'}
              dish={dish}
              position="absolute"
              top={-3}
              left={-3}
            />
          )}
        </AbsoluteVStack>
        <Squircle
          width={width}
          height={height}
          isHovered={isHovered}
          {...(dish.isFallback && {
            opacity: 0.8,
          })}
        >
          {!!dish.image && (
            <Image
              source={{ uri: imageUrl }}
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
          width="100%"
          // marginHorizontal={-15}
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
            backgroundColor="rgba(255,255,255,0.4)"
            borderTopColor="rgba(255,255,255,1)"
            borderTopWidth={1}
            // shadowColor="rgba(0,0,0,0.075)"
            // shadowRadius={8}
            // shadowOffset={{ height: -3, width: 0 }}
            {...(isHovered && {
              backgroundColor: 'transparent',
              shadowColor: 'transparent',
            })}
          >
            <Box
              position="relative"
              className="ease-in-out-top"
              backgroundColor="rgba(0,0,0,0.8)"
              borderRadius={80}
              paddingVertical={3}
              paddingHorizontal={8}
              maxWidth="calc(90% - 30px)"
              overflow="hidden"
              shadowColor="rgba(0,0,0,0.2)"
              shadowRadius={2}
              top={0}
              {...(isHovered && {
                top: -4,
                backgroundColor: '#fff',
                transform: [{ scale: 1.1 }],
              })}
            >
              <Text
                ellipse
                flex={1}
                overflow="hidden"
                fontSize={13}
                fontWeight="400"
                color={isHovered ? '#000' : '#fff'}
                textAlign="center"
              >
                {dish.name
                  .split(' ')
                  .map((x) => capitalize(x))
                  .join(' ')}
              </Text>
            </Box>
          </HStack>
        </HStack>
      </LinkButton>
    )
  }
)
