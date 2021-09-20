import { restaurant } from '@dish/graph/types'
import { supportsTouchWeb } from '@dish/helpers'
import { capitalize } from 'lodash'
import React, { Suspense, memo, useState } from 'react'
import {
  AbsoluteVStack,
  Box,
  Paragraph,
  StackProps,
  Text,
  VStack,
  prevent,
  useTheme,
  useThemeName,
} from 'snackui'

import { cardFrameBorderRadius, isWeb } from '../../../constants/constants'
import { getColorsForName } from '../../../helpers/getColorsForName'
import { getImageUrl } from '../../../helpers/getImageUrl'
import { DishTagItem } from '../../../helpers/getRestaurantDishes'
import { NavigableTag } from '../../../types/tagTypes'
import { SimpleCard } from '../../home/SimpleCard'
import { Image } from '../Image'
import { Link } from '../Link'
import { DishScore } from './DishScore'
import { SearchTagButton } from './SearchTagButton'

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

export type DishViewProps = DishTagItem &
  Omit<StackProps, 'size'> & {
    restaurant?: restaurant | null
    cuisine?: NavigableTag
    size?: number
    isFallback?: boolean
    disableFallbackFade?: boolean
    selected?: boolean
    noLink?: boolean
    preventLoad?: boolean
    showSearchButton?: boolean
    hideVote?: boolean
  }

export const DishView = memo((props: DishViewProps) => {
  const fallback = null
  if (props.preventLoad) {
    return fallback
  }
  return (
    <Suspense fallback={fallback}>
      <DishViewContent key={props.slug} {...props} />
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
    restaurant,
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
  const isLong = dishName.length > 17 || !!dishName.split(' ').find((x) => x.length >= 8)
  const isTiny = size < 115
  const fontSize = Math.max(13, (isLong ? 14 : 16) * (isTiny ? 0.75 : 1))
  const colors = getColorsForName(name)
  const themeName = useThemeName()
  const theme = useTheme()
  const backgroundColor = themeName === 'dark' ? colors.color600 : colors.color200
  const isActive = (isHovered || selected) ?? false

  const showVote = !hideVote && typeof score === 'number' && !!restaurant && !!name

  const showSearchButton_ = showSearchButton && isActive && slug

  let contents = (
    <>
      <AbsoluteVStack
        className="ease-in-out-fast"
        fullscreen
        alignItems="flex-end"
        justifyContent="center"
        zIndex={4}
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        {showVote && !!slug && (
          <AbsoluteVStack zIndex={1000000} top={0} left={0} y={-6} x={-6}>
            <Suspense fallback={null}>
              <DishScore
                shadowed
                size="sm"
                subtle={isWeb && !supportsTouchWeb}
                slug={slug}
                score={score || 0}
                rating={rating}
                restaurant={restaurant}
              />
            </Suspense>
          </AbsoluteVStack>
        )}

        <AbsoluteVStack
          opacity={showSearchButton_ ? 1 : 0}
          pointerEvents={showSearchButton_ ? 'auto' : 'none'}
          onPress={prevent}
          zIndex={888}
          bottom="-10%"
          right="-10%"
        >
          <SearchTagButton
            backgroundColor={colors.color200}
            color={colors.color400}
            // @ts-ignore
            tag={{ slug, type: 'dish' }}
          />
        </AbsoluteVStack>

        <VStack
          position="absolute"
          bottom="8%"
          left="10%"
          className="ease-in-out-fast will-change-transform"
          backgroundColor={theme.backgroundColor}
          borderRadius={8}
          paddingVertical={3}
          paddingHorizontal={8}
          maxWidth={isWeb ? '90%' : '100%'}
          overflow="hidden"
          x={-10}
          skewX="-12deg"
          zIndex={1000}
          {...(isActive && {
            backgroundColor: '#000',
            x: -10,
            skewX: '-12deg',
          })}
        >
          <Paragraph
            className="ease-in-out-fast"
            // flex={1} breaks native
            overflow="hidden"
            fontWeight="700"
            letterSpacing={-0.5}
            fontSize={fontSize}
            textAlign="center"
            transform={[{ skewX: '12deg' }]}
          >
            {dishName}
          </Paragraph>
        </VStack>
      </AbsoluteVStack>

      {!!image && (
        // <VStack
        // // BUG cant put transform on same as borderRadius + overflowHidden
        // // https://stackoverflow.com/questions/21087979/probleme-css3-scale-transform-and-overflowhidden-on-safari
        // // transform={[{ scale: isFallback ? 0.8 : 0.9 }]}
        // >
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: 1000,
          }}
          resizeMode="cover"
        />
        // </VStack>
      )}

      {!image && (
        // native needs this vstack
        <VStack width={size} height={size} alignItems="center" justifyContent="center">
          <Text fontSize={80}>{icon || '🥗'}</Text>
        </VStack>
      )}
    </>
  )

  if (!noLink) {
    contents = (
      <Link
        {...(restaurant
          ? {
              name: 'restaurant',
              params: {
                slug: restaurant.slug || '',
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
    <SimpleCard
      backgroundColor={backgroundColor}
      borderColor={selected ? '#000' : 'transparent'}
      borderRadius={1000}
      // borderWidth={1}
      pointerEvents="auto"
      size={size < 40 ? 'sm' : 'md'}
      {...rest}
    >
      {contents}
    </SimpleCard>
  )
}

// {/* performance */}
// {!isTouchDevice && (
//   <AbsoluteVStack fullscreen borderRadius={10000} overflow="hidden">
//     {/* {isFallback && (
//     <AbsoluteVStack
//       fullscreen
//       transform={[{ translateX: -size * 0.75 }, { translateY: size * 0.42 }]}
//     >
//       <SineWave color={backgroundColor} size={size + 10} />
//     </AbsoluteVStack>
//   )} */}
//     <LinearGradient
//       style={[StyleSheet.absoluteFill]}
//       colors={[
//         `${backgroundColor}${isFallback && !disableFallbackFade ? 'aa' : '44'}`,
//         `${backgroundColor}${isFallback && !disableFallbackFade ? '55' : '00'}`,
//         `${colors.color400}${isFallback && !disableFallbackFade ? 'aa' : '44'}`,
//       ]}
//       start={[0, 0.5]}
//       end={[0.5, 0.5]}
//     />
//   </AbsoluteVStack>
// )}

// const SineWave = ({ color, size }: { color: string; size: number }) => {
//   return (
//     <VStack transform={[{ scale: size / 385 }, { translateX: (385 - size / 385) / 2 }]}>
//       <Svg width="385px" height="169px" viewBox="0 0 385 169">
//         <G transform="translate(-83.000000, -142.000000)" fill={color}>
//           <Path d="M83,169.121094 C153.643229,133.990885 221.466146,133.990885 286.46875,169.121094 C351.471354,204.251302 411.981771,204.251302 468,169.121094 L468,310.121094 L83,310.121094 L83,169.121094 Z" />
//         </G>
//       </Svg>
//     </VStack>
//   )
// }
