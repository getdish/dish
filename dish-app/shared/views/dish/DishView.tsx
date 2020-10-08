import { slugify } from '@dish/graph'
import { AbsoluteVStack, Box, HStack, StackProps, Text, VStack } from '@dish/ui'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useState } from 'react'
import { Image } from 'react-native'

import { isWeb } from '../../constants'
import { getImageUrl } from '../../helpers/getImageUrl'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { NavigableTag } from '../../state/NavigableTag'
import { LinkButton } from '../ui/LinkButton'
import { Squircle } from '../ui/Squircle'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'
import { getDishBackgroundColor } from './getDishBackgroundColor'

// avoid too many different image sizes
const getRoundedDishViewSize = (size: number) => {
  if (size < 180) {
    return [160 * 0.9, 160] as const
  }
  return [size * 0.9, size] as const
}

export const DishView = memo(
  ({
    dish,
    cuisine,
    size = 100,
    restaurantSlug,
    restaurantId,
    selected,
    isFallback: _isFallback,
    ...rest
  }: {
    restaurantId?: string
    name?: any
    cuisine?: NavigableTag
    dish: DishTagItem
    size?: number
    restaurantSlug?: string
    isFallback?: boolean
    selected?: boolean
  } & StackProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const dishName = (dish.name ?? '')
      .split(' ')
      .map((x) => capitalize(x))
      .join(' ')

    const width = size * 0.9
    const height = size
    console.log('dish', dish)
    const imageUrl = getImageUrl(
      dish.image,
      ...getRoundedDishViewSize(size),
      100
    )
    const borderRadius = size * 0.1
    const hasLongWord = !!dishName.split(' ').find((x) => x.length >= 8)
    const isFallback = _isFallback ?? dish.isFallback
    const backgroundColor = getDishBackgroundColor(dish.name)

    return (
      <LinkButton
        className="ease-in-out-faster"
        alignItems="center"
        position="relative"
        justifyContent="center"
        // width={width}
        height={height}
        pressStyle={{
          transform: [{ scale: 0.98 }],
          opacity: 1,
        }}
        hoverStyle={{
          zIndex: 2,
          transform: [{ scale: 1.02 }],
        }}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
        {...(restaurantSlug
          ? {
              name: 'gallery',
              params: {
                restaurantSlug,
                dishId: slugify(dish.name ?? ''),
              },
            }
          : {
              tags: [
                cuisine,
                { type: 'dish', name: dish.name },
              ] as NavigableTag[],
            })}
        {...rest}
      >
        {/* rating */}
        {!!dish.score && (
          <AbsoluteVStack
            width={20}
            height={20}
            pointerEvents="none"
            zIndex={1000000}
            top={-8}
            left={-8}
          >
            <Suspense fallback={null}>
              <DishUpvoteDownvote
                size="sm"
                name={dish.name}
                subtle
                score={dish.score}
                restaurantId={restaurantId}
                restaurantSlug={restaurantSlug}
              />
            </Suspense>
          </AbsoluteVStack>
        )}

        <Squircle
          width={width}
          height={height}
          borderRadius={borderRadius}
          isHovered={isHovered}
          backgroundColor={backgroundColor}
          borderColor="transparent"
          {...(selected && {
            borderColor: 'blue',
          })}
          outside={
            <HStack
              className="ease-in-out"
              position="absolute"
              fullscreen
              borderRadius={borderRadius - 1}
              alignItems="flex-end"
              justifyContent="center"
              {...(isHovered && {
                transform: [{ scale: 1.05 }],
                zIndex: 3,
              })}
            >
              {/* icon? */}
              {dish.icon && (
                <Text
                  className="ease-in-out"
                  zIndex={10}
                  position="absolute"
                  top="2%"
                  right="2%"
                  fontSize={40}
                  transform={[{ scale: 1 }]}
                >
                  {dish.icon}
                </Text>
              )}
              <Box
                position="relative"
                className="skewX ease-in-out-fast"
                backgroundColor="#fff"
                borderRadius={8}
                paddingVertical={3}
                paddingHorizontal={8}
                maxWidth={isWeb ? 'calc(90% - 30px)' : '85%'}
                overflow="hidden"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius={2}
                zIndex={1000}
                bottom={-8}
                {...(isHovered && {
                  backgroundColor: '#000',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  transform: [
                    { scale: 1.05 },
                    { skewX: '-12deg' },
                    { translateY: -10 },
                  ],
                })}
              >
                <Text
                  className="unskewX ease-in-out-fast"
                  // flex={1} breaks native
                  overflow="hidden"
                  fontWeight="400"
                  color={isHovered ? '#fff' : '#000'}
                  fontSize={hasLongWord ? 14 : 16}
                  textAlign="center"
                >
                  {dishName}
                </Text>
              </Box>
            </HStack>
          }
        >
          {!!dish.image && (
            <>
              <VStack
                position="absolute"
                backgroundColor="rgba(0,0,0,0.1)"
                borderRadius={100}
                width={size * 0.75}
                height={size * 0.75}
              />
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 1,
                  ...(isFallback && {
                    borderRadius: 100,
                    width: size * 0.75,
                    height: size * 0.75,
                  }),
                }}
                resizeMode="cover"
              />
            </>
          )}
          {!dish.image && <Text fontSize={80}>🥗</Text>}
        </Squircle>
      </LinkButton>
    )
  }
)
