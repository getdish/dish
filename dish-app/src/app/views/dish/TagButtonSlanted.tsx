import { capitalize } from 'lodash'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import { Box, HStack, StackProps, Text, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { Link } from '../Link'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'

export type TagButtonSlantedProps = Partial<DishTagItem> & {
  restaurantId?: string
  restaurantSlug?: string
  selected?: boolean
  noLink?: boolean
  showSearchButton?: boolean
  hideVote?: boolean
  bold?: boolean
}

export const TagButtonSlanted = memo((props: TagButtonSlantedProps) => {
  return (
    <Suspense fallback={null}>
      <DishButtonContent {...props} />
    </Suspense>
  )
})

const DishButtonContent = (props: TagButtonSlantedProps) => {
  const {
    name,
    score,
    icon,
    image,
    slug,
    rating,
    restaurantSlug,
    noLink,
    bold,
  } = props
  const dishName = (name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  const imageUrl = getImageUrl(image ?? '', 100, 100, 100)
  const isLong =
    dishName.length > 20 || !!dishName.split(' ').find((x) => x.length >= 10)
  const fontSize = isLong ? 15 : 16
  const theme = useTheme()

  let contents = (
    <>
      <Box
        className="ease-in-out-fast"
        backgroundColor={theme.backgroundColor}
        borderRadius={8}
        paddingVertical={3}
        height={38}
        justifyContent="center"
        paddingHorizontal={8}
        transform={[{ skewX: '-12deg' }]}
        shadowColor="rgba(0,0,0,0.05)"
        shadowRadius={2}
        zIndex={1000}
        cursor="pointer"
        // {...rest}
      >
        <HStack transform={[{ skewX: '12deg' }]} spacing alignItems="center">
          {!!image ? (
            <VStack
              overflow="hidden"
              borderRadius={1000}
              // margin={-10}
              // marginRight={0}
              // marginLeft={-20}
            >
              <ImageAlt
                source={{ uri: imageUrl }}
                style={{
                  width: 36,
                  height: 36,
                }}
                resizeMode="cover"
              />
            </VStack>
          ) : (
            <VStack width={1} />
          )}

          {!!icon && (
            <Text
              className="ease-in-out"
              zIndex={10}
              fontSize={28}
              transform={[{ scale: 1 }]}
              marginLeft={image ? -30 : 0}
            >
              {icon}
            </Text>
          )}

          <Text
            className="ease-in-out-fast"
            overflow="hidden"
            fontWeight={bold ? '800' : '400'}
            color={theme.color}
            fontSize={fontSize}
            textAlign="center"
          >
            {dishName}
          </Text>

          {typeof score !== 'undefined' ? (
            <DishUpvoteDownvote
              size="sm"
              slug={slug || ''}
              score={score}
              rating={rating ?? 0}
              restaurantSlug={restaurantSlug}
            />
          ) : (
            <VStack width={1} />
          )}
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
