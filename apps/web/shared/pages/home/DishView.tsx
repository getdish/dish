import { TopCuisineDish, slugify } from '@dish/graph'
import {
  AbsoluteVStack,
  Box,
  HStack,
  SmallTitle,
  StackProps,
  Text,
} from '@dish/ui'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useState } from 'react'
import { Image } from 'react-native'

import { IMAGE_PROXY_DOMAIN } from '../../constants'
import { NavigableTag } from '../../state/NavigableTag'
import { LinkButton } from '../../views/ui/LinkButton'
import { DishRatingView } from './DishRatingView'
import { DishVoteButton } from './DishVoteButton'
import { Squircle } from './Squircle'

export const DishView = memo(
  ({
    dish,
    cuisine,
    size = 100,
    restaurantSlug,
    restaurantId,
    selected,
    ...rest
  }: {
    cuisine?: NavigableTag
    dish: TopCuisineDish
    size?: number
    restaurantSlug?: string
    restaurantId?: string
    selected?: boolean
  } & StackProps) => {
    const [isHovered, setIsHovered] = useState(false)
    const dishName = (dish.name ?? '')
      .split(' ')
      .map((x) => capitalize(x))
      .join(' ')

    const width = size * 0.9
    const height = size
    const imageUrl = getImageUrl(size, width, height, dish.image)
    const borderRadius = size * 0.1

    return (
      <LinkButton
        className="ease-in-out-fast"
        alignItems="center"
        position="relative"
        justifyContent="center"
        width={width}
        height={height}
        pressStyle={{
          transform: [{ scale: 0.98 }],
          opacity: 1,
        }}
        hoverStyle={{
          transform: [{ scale: 1.025 }],
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
        <AbsoluteVStack pointerEvents="none" zIndex={10} top={-3} left={-8}>
          {!!dish.rating && (
            <DishRatingView
              size={size > 160 ? 'sm' : 'xs'}
              rating={dish.rating}
            />
          )}
        </AbsoluteVStack>
        {restaurantId && (
          <AbsoluteVStack
            fullscreen
            alignItems="flex-end"
            right={-5}
            justifyContent="center"
            opacity={0}
            hoverStyle={{
              opacity: 1,
            }}
            zIndex={1000}
          >
            <Suspense fallback={null}>
              <DishVoteButton
                size={size > 130 ? 'md' : 'sm'}
                dishTagId={dish.name ?? ''}
                restaurantId={restaurantId}
              />
            </Suspense>
          </AbsoluteVStack>
        )}
        {isHovered && dish.reviews && (
          <AbsoluteVStack
            alignItems="center"
            justifyContent="center"
            zIndex={1000}
          >
            <Box width={120} height={100}>
              <SmallTitle>Reviews ({dish.reviews.length})</SmallTitle>
              {dish.reviews.map((r) => {
                return (
                  <>
                    <Text fontSize={10}>
                      {r.sentiments.map((s) => {
                        return (
                          <Text>
                            {s.setence} ({s.sentiment})
                          </Text>
                        )
                      })}
                    </Text>
                    <Text fontSize={8}>{r.text}</Text>
                  </>
                )
              })}
            </Box>
          </AbsoluteVStack>
        )}
        <Squircle
          width={width}
          height={height}
          borderRadius={borderRadius}
          isHovered={isHovered}
          backgroundColor="#fff"
          borderWidth={2}
          borderColor="transparent"
          // dish.isFallback
          {...(selected && {
            borderColor: 'blue',
          })}
          outside={
            <HStack
              className="ease-in-out"
              position="absolute"
              fullscreen
              borderRadius={borderRadius}
              alignItems="center"
              justifyContent="center"
              backgroundColor="rgba(0,0,0,0.18)"
              // backgroundColor="rgba(255,255,255,0.25)"
              {...(isHovered && {
                borderTopColor: 'transparent',
                backgroundColor: 'transparent',
                shadowColor: 'transparent',
                transform: [{ scale: 1.1 }],
                zIndex: 100000,
              })}
            >
              <Box
                position="relative"
                className="skewX ease-in-out-top"
                backgroundColor="rgba(0,0,0,0.8)"
                borderRadius={8}
                paddingVertical={3}
                paddingHorizontal={8}
                maxWidth="calc(90% - 30px)"
                overflow="hidden"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius={2}
                top={0}
                {...(isHovered && {
                  top: -5,
                  backgroundColor: '#fff',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  transform: [{ scale: 1.2 }, { skewX: '-12deg' }],
                })}
              >
                <Text
                  ellipse
                  className="unskewX"
                  flex={1}
                  overflow="hidden"
                  fontSize={
                    (height > 150 ? 14 : 12) * (dishName.length > 12 ? 0.95 : 1)
                  }
                  fontWeight="600"
                  color={isHovered ? '#000' : '#fff'}
                  textAlign="center"
                >
                  {dishName}
                </Text>
              </Box>
            </HStack>
          }
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
      </LinkButton>
    )
  }
)

// I made this its own function just because the backticks were breaking my syntax highlighter
// @tombh
const getImageUrl = (
  size: number,
  width: number,
  height: number,
  dish_image: string
) => {
  const quality = size > 160 ? 100 : 100
  const imageUrl = `${IMAGE_PROXY_DOMAIN}/${width}x${height},q${quality}/${dish_image}`
  return imageUrl
}
