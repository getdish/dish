import { capitalize } from 'lodash'
import React, { Suspense, memo } from 'react'
import { AbsoluteVStack, Box, HStack, Spacer, Text, VStack, useTheme } from 'snackui'

import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { Image } from '../Image'
import { Link } from '../Link'
import { TextSuperScript } from '../TextSuperScript'
import { DishScore } from './DishScore'
import { SearchTagButton } from './SearchTagButton'

export type TagButtonSlantedProps = Partial<DishTagItem> & {
  restaurantId?: string
  restaurantSlug?: string
  noLink?: boolean
  showSearchButton?: boolean
  hideVote?: boolean
  bold?: boolean
  maxTextWidth?: number
  isActive?: boolean
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
    isActive,
    maxTextWidth,
    showSearchButton,
    bold,
  } = props
  const dishName = (name ?? '')
    .split(' ')
    .map((x) => capitalize(x))
    .join(' ')

  const imageUrl = getImageUrl(image ?? '', 120, 120, 120)
  const isLong = dishName.length > 20 || !!dishName.split(' ').find((x) => x.length >= 10)
  const fontSize = isLong ? 13 : 15
  const theme = useTheme()

  let contents = (
    <>
      <Box
        backgroundColor={isActive ? theme.cardBackgroundColor : theme.backgroundColor}
        hoverStyle={{
          backgroundColor: isActive ? theme.cardBackgroundColor : theme.backgroundColorSecondary,
        }}
        borderRadius={16}
        borderWidth={0}
        paddingVertical={3}
        height={38}
        justifyContent="center"
        paddingHorizontal={12}
        skewX="-12deg"
        zIndex={1000}
        cursor="pointer"
        // {...rest}
      >
        <HStack skewX="12deg" spacing="sm" alignItems="center">
          {!!image && (
            <VStack
              overflow="hidden"
              borderRadius={1000}
              width={50}
              height={50}
              marginVertical={-5}
              marginLeft={-5}
            >
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode="cover"
              />
            </VStack>
          )}

          {!!icon && (
            <Text
              className="ease-in-out"
              zIndex={10}
              fontSize={18}
              marginLeft={image ? -30 : 0}
              marginRight={-4}
            >
              {icon}
            </Text>
          )}

          {!!rank && (
            <Text
              marginLeft={2}
              marginRight={-5}
              fontSize={fontSize * 0.7}
              color={theme.colorTertiary}
              opacity={0.5}
            >
              <TextSuperScript opacity={0.5}>#</TextSuperScript>
              {rank}
            </Text>
          )}

          <Text
            className="ease-in-out-fast"
            fontWeight={bold ? '800' : '700'}
            color={bold ? theme.color : isActive ? theme.color : theme.colorSecondary}
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
            <>
              <DishScore
                size="sm"
                slug={slug || ''}
                score={score}
                rating={rating ?? 0}
                restaurantSlug={restaurantSlug}
              />
              <Spacer size="sm" />
            </>
          )}

          {showSearchButton && !!slug && (
            <AbsoluteVStack bottom={-10} right={-10} scale={0.7} hoverStyle={{ scale: 0.75 }}>
              <SearchTagButton tag={{ type: 'dish', slug }} backgroundColor="#fff" color="#000" />
            </AbsoluteVStack>
          )}
        </HStack>
      </Box>
    </>
  )

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
