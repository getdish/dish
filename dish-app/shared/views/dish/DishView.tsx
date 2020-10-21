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
import { Link } from '../ui/Link'
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

    const width = size
    const height = size
    const imageUrl = getImageUrl(
      dish.image,
      ...getRoundedDishViewSize(size),
      100
    )
    const borderRadius = Math.round(size * 0.08)
    const hasLongWord = !!dishName.split(' ').find((x) => x.length >= 8)
    const isFallback = _isFallback ?? dish.isFallback
    const backgroundColor = getDishColors(dish.name).lightColor
    const isActive = isHovered || selected

    return (
      <VStack
        position="relative"
        zIndex={isHovered ? 1 : 0}
        className="ease-in-out-faster"
        alignItems="center"
        justifyContent="center"
        pressStyle={{
          transform: [{ scale: 0.98 }],
          opacity: 1,
        }}
        hoverStyle={{
          transform: [{ scale: 1.02 }],
        }}
        width={width}
        height={height}
        borderRadius={1000}
        // isHovered={isHovered}
        backgroundColor={backgroundColor}
        borderColor={selected ? '#000' : 'transparent'}
        shadowColor="#000"
        shadowOpacity={0.1}
        shadowRadius={10}
        {...rest}
      >
        <Link
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
        >
          <HStack
            onHoverIn={() => setIsHovered(true)}
            onHoverOut={() => setIsHovered(false)}
          >
            {typeof dish.score === 'number' && (
              <AbsoluteVStack
                width={20}
                height={20}
                pointerEvents="none"
                zIndex={1000000}
                top={2}
                left={2}
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

            <AbsoluteVStack
              className="ease-in-out"
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
                position="absolute"
                bottom="10%"
                left="5%"
                className="ease-in-out-fast"
                backgroundColor="#fff"
                borderRadius={8}
                paddingVertical={3}
                paddingHorizontal={8}
                maxWidth="100%"
                overflow="hidden"
                transform={[{ translateX: -10 }, { skewX: '-12deg' }]}
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius={2}
                zIndex={1000}
                {...(isActive && {
                  backgroundColor: '#000',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  transform: [
                    { scale: 1.05 },
                    { translateX: -10 },
                    { skewX: '-12deg' },
                  ],
                })}
              >
                <Text
                  className="unskewX ease-in-out-fast"
                  // flex={1} breaks native
                  overflow="hidden"
                  fontWeight="600"
                  color={isActive ? '#fff' : '#000'}
                  fontSize={hasLongWord ? 14 : 16}
                  textAlign="center"
                >
                  {dishName}
                </Text>
              </Box>
            </AbsoluteVStack>
            {!!dish.image && (
              <VStack
                overflow="hidden"
                borderRadius={100}
                {...(isFallback && {
                  width: Math.round(size * 0.95),
                  height: Math.round(size * 0.95),
                })}
              >
                <ImageAlt
                  source={{ uri: imageUrl }}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                  resizeMode="cover"
                />
              </VStack>
            )}
            {!dish.image && <Text fontSize={80}>🥗</Text>}
          </HStack>
        </Link>
      </VStack>
    )
  }
)

const ImageAlt = (props: any) => {
  if (isWeb) {
    return <img src={props.source.uri} style={props.style} loading="lazy" />
  }
  return <Image {...props} />
}
