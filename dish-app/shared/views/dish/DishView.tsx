import { Search } from '@dish/react-feather'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  Box,
  Hoverable,
  LinearGradient,
  StackProps,
  Text,
  VStack,
  prevent,
} from 'snackui'

import { isWeb } from '../../constants'
import { getColorsForName } from '../../helpers/getColorsForName'
import { getImageUrl } from '../../helpers/getImageUrl'
import { DishTagItem } from '../../helpers/getRestaurantDishes'
import { getTagSlug } from '../../state/getTagSlug'
import { NavigableTag } from '../../state/NavigableTag'
import { Link } from '../ui/Link'
import { ColoredCircle } from './ColoredCircle'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'

// avoid too many different image sizes
const getRoundedDishViewSize = (size: number) => {
  if (size < 180) {
    return [160 * 0.9, 160] as const
  }
  return [size * 0.9, size] as const
}

export type DishViewProps = {
  restaurantId?: string
  restaurantSlug?: string
  name?: any
  cuisine?: NavigableTag
  dish: DishTagItem

  size?: number
  isFallback?: boolean
  disableFallbackFade?: boolean
  selected?: boolean
  noLink?: boolean
  preventLoad?: boolean
  showSearchButton?: boolean
} & StackProps

export const DishView = memo((props: DishViewProps) => {
  const fallback = (
    <ColoredCircle size={props.size ?? 150} backgroundColor="#ccc" />
  )

  if (props.preventLoad) {
    return fallback
  }

  return (
    <Suspense fallback={fallback}>
      <DishViewContent {...props} />
    </Suspense>
  )
})

const DishViewContent = (props: DishViewProps) => {
  const {
    dish,
    cuisine,
    size = 100,
    restaurantSlug,
    restaurantId,
    selected,
    disableFallbackFade,
    isFallback: _isFallback,
    noLink,
    showSearchButton,
    ...rest
  } = props
  const [isHovered, setIsHovered] = useState(false)
  const dishName = (dish.name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  const imageUrl = getImageUrl(dish.image, ...getRoundedDishViewSize(size), 100)
  const hasLongWord = !!dishName.split(' ').find((x) => x.length >= 8)
  const isTiny = size < 115
  const fontSize = (hasLongWord ? 14 : 16) * (isTiny ? 0.8 : 1)
  const isFallback = _isFallback ?? dish.isFallback
  const sizeInner = Math.round(isFallback ? size * 0.8 : size * 0.975)
  const { lightColor, color } = getColorsForName(dish.name)
  const backgroundColor = lightColor
  const isActive = isHovered || selected

  const showVote =
    typeof dish.score === 'number' &&
    !!restaurantId &&
    !!restaurantSlug &&
    !!dish.name

  let contents = (
    <Hoverable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {showVote && (
        <AbsoluteVStack
          width={20}
          height={20}
          pointerEvents="none"
          zIndex={1000000}
          top={2}
          left={2}
        >
          <Suspense fallback={null}>
            <DishUpvoteDownvote
              size="sm"
              name={dish.name}
              subtle
              score={dish.score}
              {...(restaurantId &&
                restaurantSlug && {
                  restaurantId,
                  restaurantSlug,
                })}
            />
          </Suspense>
        </AbsoluteVStack>
      )}

      <AbsoluteVStack
        className="ease-in-out"
        fullscreen
        pointerEvents="none"
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
            bottom="15%"
            left="0%"
            fontSize={28}
            transform={[{ scale: 1 }]}
          >
            {dish.icon}
          </Text>
        )}

        {showSearchButton && (
          <AbsoluteVStack
            onPress={prevent}
            zIndex={888}
            bottom="7.5%"
            right="7.5%"
          >
            <Link tag={dish}>
              <VStack
                width={28}
                height={28}
                borderRadius={1000}
                backgroundColor={backgroundColor}
                shadowColor="#000"
                shadowOpacity={0.1}
                shadowRadius={5}
                shadowOffset={{ height: 1, width: 0 }}
                alignItems="center"
                justifyContent="center"
                hoverStyle={{
                  transform: [{ scale: 1.1 }],
                }}
              >
                <Search size={16} color={color} />
              </VStack>
            </Link>
          </AbsoluteVStack>
        )}

        <Box
          position="absolute"
          bottom="8%"
          left="10%"
          className="ease-in-out-fast"
          backgroundColor="#fff"
          borderRadius={8}
          paddingVertical={3}
          paddingHorizontal={8}
          maxWidth="60%"
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
            fontWeight="700"
            color={isActive ? '#fff' : '#000'}
            fontSize={fontSize}
            textAlign="center"
          >
            {dishName}
          </Text>
        </Box>
      </AbsoluteVStack>
      {!!dish.image && (
        <VStack overflow="hidden" borderRadius={100}>
          <ImageAlt
            source={{ uri: imageUrl }}
            style={{
              width: sizeInner,
              height: sizeInner,
            }}
            resizeMode="cover"
          />
        </VStack>
      )}
      <AbsoluteVStack fullscreen borderRadius={10000} overflow="hidden">
        <LinearGradient
          style={[StyleSheet.absoluteFill]}
          colors={[
            `${backgroundColor}${
              isFallback && !disableFallbackFade ? '88' : '44'
            }`,
            `${backgroundColor}${
              isFallback && !disableFallbackFade ? '55' : '00'
            }`,
            `${color}${isFallback && !disableFallbackFade ? '88' : '44'}`,
          ]}
          start={[0, 0.5]}
          end={[0.5, 0.5]}
        />
      </AbsoluteVStack>
      {!dish.image && <Text fontSize={80}>🥗</Text>}
    </Hoverable>
  )

  if (dish.name && !dish.slug) {
    console.warn('dish', dish)
  }

  if (!noLink) {
    contents = (
      <Link
        {...(restaurantSlug
          ? {
              name: 'restaurant',
              params: {
                slug: restaurantSlug,
                section: 'reviews',
                sectionSlug: getTagSlug(dish),
              },
            }
          : {
              tags: [
                cuisine,
                { type: 'dish', name: dish.name },
              ] as NavigableTag[],
            })}
      >
        {contents}
      </Link>
    )
  }

  return (
    <ColoredCircle
      backgroundColor={backgroundColor}
      borderColor={selected ? '#000' : 'transparent'}
      borderWidth={1}
      size={size}
      {...rest}
    >
      {contents}
    </ColoredCircle>
  )
}

const ImageAlt = (props: any) => {
  if (isWeb) {
    return <img src={props.source.uri} style={props.style} loading="lazy" />
  }
  return <Image {...props} />
}
