import { slugify } from '@dish/graph'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useState } from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Box, HStack, StackProps, Text, VStack } from 'snackui'

import { blue } from '../../colors'
import { isWeb } from '../../constants'
import { getImageUrl } from '../../helpers/getImageUrl'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { NavigableTag } from '../../state/NavigableTag'
import { LinkButton } from '../ui/LinkButton'
import { Squircle } from '../ui/Squircle'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'
import { getDishColors } from './getDishBackgroundColor'

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
    restaurantSlug?: string
    name?: any
    cuisine?: NavigableTag
    dish: DishTagItem
    size?: number
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
    const imageUrl = getImageUrl(
      dish.image,
      ...getRoundedDishViewSize(size),
      100
    )
    const borderRadius = size * 0.15
    const hasLongWord = !!dishName.split(' ').find((x) => x.length >= 8)
    const isFallback = _isFallback ?? dish.isFallback
    const backgroundColor = getDishColors(dish.name).lightColor
    const isActive = isHovered || selected

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
        {typeof dish.score === 'number' && (
          <AbsoluteVStack
            width={20}
            height={20}
            pointerEvents="none"
            zIndex={1000000}
            top={-8}
            left={-8}
          >
            <Suspense fallback={null}>
              {!!dish.name && (
                <DishUpvoteDownvote
                  size="sm"
                  name={dish.name}
                  subtle
                  score={dish.score}
                  restaurantId={restaurantId}
                  restaurantSlug={restaurantSlug}
                />
              )}
            </Suspense>
          </AbsoluteVStack>
        )}

        <Squircle
          className={!isFallback ? 'dish-inset-shadow' : ''}
          width={width}
          height={height}
          borderRadius={borderRadius}
          isHovered={isHovered}
          backgroundColor={backgroundColor}
          borderColor={selected ? '#000' : 'transparent'}
          borderWidth={2}
          outside={
            <HStack
              className="ease-in-out"
              position="absolute"
              fullscreen
              borderRadius={borderRadius - 1}
              alignItems="flex-end"
              justifyContent="center"
              zIndex={4}
              {...(isActive && {
                transform: [{ scale: 1.05 }],
                zIndex: 3,
              })}
            >
              {!!dish.icon && (
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
                maxWidth="100%"
                overflow="hidden"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius={2}
                zIndex={1000}
                bottom={-8}
                {...(isActive && {
                  backgroundColor: '#000',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  transform: [
                    { scale: 1.05 },
                    { skewX: '-12deg' },
                    { translateY: -5 },
                  ],
                })}
              >
                <Text
                  className="unskewX ease-in-out-fast"
                  // flex={1} breaks native
                  overflow="hidden"
                  fontWeight="400"
                  color={isActive ? '#fff' : '#000'}
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
              <AbsoluteVStack
                backgroundColor="rgba(0,0,0,0.1)"
                borderRadius={100}
                width={size * 0.8}
                height={size * 0.8}
              />
              <ImageAlt
                source={{ uri: imageUrl }}
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 1,
                  ...(isFallback && {
                    borderRadius: 100,
                    width: size * 0.8,
                    height: size * 0.8,
                  }),
                  ...(!isFallback &&
                    {
                      // width: size * 0.8,
                      // height: size * 0.8,
                      // transform: [{ translateX: 20 }, { translateY: 20 }],
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

const ImageAlt = (props: any) => {
  if (isWeb) {
    return <img src={props.source.uri} style={props.style} loading="lazy" />
  }
  return <Image {...props} />
}
