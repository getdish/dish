// // debug
import { capitalize } from 'lodash'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import { Box, HStack, StackProps, Text, VStack } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { Link } from '../Link'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'

export type DishButtonProps = DishTagItem & {
  restaurantId?: string
  restaurantSlug?: string
  selected?: boolean
  noLink?: boolean
  showSearchButton?: boolean
  hideVote?: boolean
  isActive?: boolean
} & StackProps

export const DishButton = memo((props: DishButtonProps) => {
  return (
    <Suspense fallback={null}>
      <DishButtonContent {...props} />
    </Suspense>
  )
})

const DishButtonContent = (props: DishButtonProps) => {
  const {
    // dish specific things
    name,
    score,
    icon,
    image,
    slug,
    rating,
    isActive,
    // rest
    restaurantSlug,
    restaurantId,
    noLink,
    ...rest
  } = props
  const dishName = (name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  const imageUrl = getImageUrl(image, 30, 30, 100)
  const isLong =
    dishName.length > 17 || !!dishName.split(' ').find((x) => x.length >= 8)
  const fontSize = isLong ? 16 : 18

  let contents = (
    <>
      <Box
        className="ease-in-out-fast"
        backgroundColor="#fff"
        borderRadius={8}
        paddingVertical={3}
        paddingHorizontal={8}
        transform={[{ skewX: '-12deg' }]}
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={2}
        zIndex={1000}
        cursor="pointer"
        {...(isActive && {
          backgroundColor: '#000',
          shadowColor: 'rgba(0,0,0,0.2)',
        })}
      >
        <HStack transform={[{ skewX: '12deg' }]} spacing alignItems="center">
          {!!image && (
            <VStack overflow="hidden" borderRadius={1000}>
              <ImageAlt
                source={{ uri: imageUrl }}
                style={{
                  width: 32,
                  height: 32,
                }}
                resizeMode="cover"
              />
            </VStack>
          )}

          {!!icon && (
            <Text
              className="ease-in-out"
              zIndex={10}
              fontSize={28}
              transform={[{ scale: 1 }]}
            >
              {icon}
            </Text>
          )}

          <Text
            className="ease-in-out-fast"
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

          <DishUpvoteDownvote
            size="sm"
            name={name}
            slug={slug || ''}
            score={score}
            rating={(rating ?? 0) * 100}
            restaurantId={restaurantId}
            restaurantSlug={restaurantSlug}
          />
        </HStack>
      </Box>
    </>
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
          : null)}
      >
        {contents}
      </Link>
    )
  }

  return contents
}

const ImageAlt = (props: any) => {
  if (isWeb) {
    return <img src={props.source.uri} style={props.style} loading="lazy" />
  }
  return <Image {...props} />
}
