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

import { IMAGE_PROXY_DOMAIN, isWeb } from '../../constants'
import { NavigableTag } from '../../state/NavigableTag'
import { LinkButton } from '../../views/ui/LinkButton'
import { DishRatingView } from './DishRatingView'
import { Squircle } from './Squircle'
import { TagVoteButton } from './TagVoteButton'

// {isHovered && dish.reviews && (
//   <AbsoluteVStack
//     alignItems="center"
//     justifyContent="center"
//     zIndex={1000}
//   >
//     <Box width={120} height={100}>
//       <SmallTitle>Reviews ({dish.reviews.length})</SmallTitle>
//       {dish.reviews.map((r) => {
//         return (
//           <>
//             <Text fontSize={10}>
//               {r.sentiments.map((s) => {
//                 return (
//                   <Text>
//                     {s.setence} ({s.sentiment})
//                   </Text>
//                 )
//               })}
//             </Text>
//             <Text fontSize={8}>{r.text}</Text>
//           </>
//         )
//       })}
//     </Box>
//   </AbsoluteVStack>
// )}

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
    name?: any
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
    const borderRadius = size * 0.25
    const hasLongWord = !!dishName.split(' ').find((x) => x.length >= 8)

    return (
      <LinkButton
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
          zIndex: 1000000,
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
        <AbsoluteVStack pointerEvents="none" zIndex={10} top={0} left={-8}>
          {!!dish.rating && (
            <DishRatingView
              size={size > 160 ? 'md' : 'sm'}
              rating={dish.rating}
            />
          )}
        </AbsoluteVStack>

        <Squircle
          width={width}
          height={height}
          borderRadius={borderRadius}
          isHovered={isHovered}
          backgroundColor="#000"
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
              alignItems="center"
              justifyContent="center"
              {...(isHovered && {
                borderTopColor: 'transparent',
                backgroundColor: 'transparent',
                transform: [{ scale: 1.1 }],
                zIndex: 100000,
              })}
            >
              <Box
                position="relative"
                className="skewX ease-in-out-top"
                backgroundColor="rgba(0,0,0,0.75)"
                borderRadius={8}
                paddingVertical={3}
                paddingHorizontal={8}
                maxWidth={isWeb ? 'calc(90% - 30px)' : '85%'}
                overflow="hidden"
                shadowColor="rgba(0,0,0,0.1)"
                shadowRadius={2}
                zIndex={1000}
                {...(isHovered && {
                  top: -5,
                  backgroundColor: '#fff',
                  shadowColor: 'rgba(0,0,0,0.2)',
                  transform: [{ scale: 1.2 }, { skewX: '-12deg' }],
                })}
              >
                <Text
                  className="unskewX ease-in-out"
                  // flex={1} breaks native
                  overflow="hidden"
                  fontWeight="300"
                  color={isHovered ? '#000' : '#fff'}
                  fontSize={hasLongWord ? 15 : 18}
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
                opacity: isHovered ? 1 : 0.75,
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
