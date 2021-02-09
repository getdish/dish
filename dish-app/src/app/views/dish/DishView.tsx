// // debug
import { supportsTouchWeb } from '@dish/helpers/src'
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

import { isWeb } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { NavigableTag } from '../../../types/tagTypes'
import { ColoredCircle } from '../ColoredCircle'
import { Link } from '../Link'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'

// avoid too many different image sizes
const smallSize = [160 * 0.9, 160] as const
const largeSize = [300 * 0.9, 300] as const

const getRoundedDishViewSize = (size: string | number) => {
  if (typeof size === 'string') {
    return smallSize
  }
  if (size <= 160) {
    return smallSize
  }
  return largeSize
}

export type DishViewProps = DishTagItem & {
  restaurantId?: string
  restaurantSlug?: string
  cuisine?: NavigableTag
  // percent or fixed
  size?: string | number
  isFallback?: boolean
  disableFallbackFade?: boolean
  selected?: boolean
  noLink?: boolean
  preventLoad?: boolean
  showSearchButton?: boolean
  hideVote?: boolean
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
    // dish specific things
    name,
    score,
    icon,
    image,
    slug,
    rating,

    // rest
    cuisine,
    size = 100,
    restaurantSlug,
    restaurantId,
    selected,
    disableFallbackFade,
    hideVote,
    isFallback,
    noLink,
    showSearchButton,
    ...rest
  } = props
  const [isHovered, setIsHovered] = useState(false)

  const dishName = (name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  // @ts-expect-error
  const imageUrl = getImageUrl(image, ...getRoundedDishViewSize(size), 100)
  const isLong =
    dishName.length > 17 || !!dishName.split(' ').find((x) => x.length >= 8)
  const isTiny = size < 115
  const fontSize = Math.max(14, (isLong ? 13 : 15) * (isTiny ? 0.75 : 1))
  const { lightColor, color } = getColorsForName(name)
  const backgroundColor = lightColor
  const isActive = (isHovered || selected) ?? false

  const showVote =
    !hideVote &&
    typeof score === 'number' &&
    !!restaurantId &&
    !!restaurantSlug &&
    !!name

  let contents = (
    <Hoverable
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
    >
      {showVote && !!slug && (
        <AbsoluteVStack
          width={20}
          height={20}
          pointerEvents="none"
          zIndex={1000000}
          top={0}
          left={0}
        >
          <Suspense fallback={null}>
            <DishUpvoteDownvote
              size="sm"
              name={name}
              subtle={isWeb && !supportsTouchWeb}
              slug={slug}
              score={score}
              rating={rating}
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
        {!!icon && (
          <Text
            className="ease-in-out"
            zIndex={10}
            position="absolute"
            bottom="15%"
            left="0%"
            fontSize={28}
            transform={[{ scale: 1 }]}
          >
            {icon}
          </Text>
        )}

        {showSearchButton && isActive && (
          <AbsoluteVStack
            onPress={prevent}
            zIndex={888}
            bottom="7.5%"
            right="7.5%"
            pointerEvents="auto"
          >
            <Link tag={{ slug, type: 'dish' }}>
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
          maxWidth="70%"
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
            letterSpacing={-0.5}
            color={isActive ? '#fff' : '#000'}
            fontSize={fontSize}
            textAlign="center"
          >
            {dishName}
          </Text>
        </Box>
      </AbsoluteVStack>
      {!!image && (
        <VStack
          // BUG cant put transform on same as borderRadius + overflowHidden
          // https://stackoverflow.com/questions/21087979/probleme-css3-scale-transform-and-overflowhidden-on-safari
          transform={[{ scale: isFallback ? 0.9 : 1 }]}
        >
          <VStack className="dish-image-" overflow="hidden" borderRadius={1000}>
            <ImageAlt
              source={{ uri: imageUrl }}
              style={{
                width: size,
                height: size,
              }}
              resizeMode="cover"
            />
          </VStack>
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
      {!image && <Text fontSize={80}>🥗</Text>}
    </Hoverable>
  )

  if (name && !slug) {
    console.warn('NO DISH INFO', name, slug)
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
                sectionSlug: slug,
              },
            }
          : {
              tags: [cuisine, { name, slug }] as NavigableTag[],
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
      pointerEvents="auto"
      size={size}
      {...rest}
      // zIndex={isHovered ? 10000000 : rest.zIndex}
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
