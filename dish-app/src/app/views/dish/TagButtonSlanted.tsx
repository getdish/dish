import { capitalize } from 'lodash'
import React, { Suspense, memo } from 'react'
import { Image } from 'react-native'
import { AbsoluteVStack, Box, HStack, Text, VStack, useTheme } from 'snackui'

import { isWeb } from '../../../constants/constants'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { Link } from '../Link'
import { TextSuperScript } from '../TextSuperScript'
import { DishUpvoteDownvote } from './DishUpvoteDownvote'
import { SearchTagButton } from './SearchTagButton'

export type TagButtonSlantedProps = Partial<DishTagItem> & {
  restaurantId?: string
  restaurantSlug?: string
  selected?: boolean
  noLink?: boolean
  showSearchButton?: boolean
  hideVote?: boolean
  bold?: boolean
  maxTextWidth?: number
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
    rank,
    rating,
    restaurantSlug,
    noLink,
    maxTextWidth,
    showSearchButton,
    bold,
  } = props
  const dishName = (name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  const imageUrl = getImageUrl(image ?? '', 120, 120, 120)
  const isLong =
    dishName.length > 20 || !!dishName.split(' ').find((x) => x.length >= 10)
  const fontSize = isLong ? 16 : 18
  const theme = useTheme()

  let contents = (
    <>
      <Box
        backgroundColor={theme.backgroundColor}
        borderRadius={16}
        paddingVertical={3}
        height={38}
        justifyContent="center"
        paddingHorizontal={12}
        transform={[{ skewX: '-12deg' }]}
        shadowColor={theme.backgroundColorTertiary}
        shadowOffset={{ height: 2, width: 2 }}
        shadowRadius={0}
        zIndex={1000}
        cursor="pointer"
        // {...rest}
      >
        <HStack
          transform={[{ skewX: '12deg' }]}
          spacing="sm"
          alignItems="center"
        >
          {!!image && (
            <VStack
              overflow="hidden"
              borderRadius={1000}
              width={50}
              height={50}
              marginVertical={-5}
              marginLeft={-5}
            >
              <ImageAlt
                source={{ uri: imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode="cover"
              />
            </VStack>
          )}

          {!!rank && (
            <Text
              fontSize={fontSize * 0.7}
              fontWeight="700"
              color={theme.color}
            >
              <TextSuperScript fontWeight="300" opacity={0.5}>
                #
              </TextSuperScript>
              {rank}
            </Text>
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
            fontWeight={bold ? '800' : '400'}
            color={theme.color}
            opacity={0.8}
            fontSize={fontSize}
            textAlign="center"
            maxWidth={maxTextWidth}
            lineHeight={fontSize}
            letterSpacing={-0.5}
          >
            {dishName}
          </Text>

          {typeof score !== 'undefined' && (
            <DishUpvoteDownvote
              size="sm"
              slug={slug || ''}
              score={score}
              rating={rating ?? 0}
              restaurantSlug={restaurantSlug}
            />
          )}

          {showSearchButton && !!slug && (
            <AbsoluteVStack bottom="-15%" right="-10%">
              <SearchTagButton
                tag={{ type: 'dish', slug }}
                backgroundColor="#fff"
                color="#000"
              />
            </AbsoluteVStack>
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
