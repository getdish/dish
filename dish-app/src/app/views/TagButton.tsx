// TODO if we can have compiler pick up a few more things speeds will go up a lot
import { Tag, TagQuery, TagType } from '@dish/graph'
import { ThumbsDown, ThumbsUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import { Image } from 'react-native'
import {
  AbsoluteVStack,
  Circle,
  HStack,
  Spacer,
  StackProps,
  Text,
  TextProps,
  VStack,
  prevent,
} from 'snackui'

import { blue, green, orange, purple, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { tagDisplayName } from '../../constants/tagDisplayName'
import { getColorsForColor } from '../../helpers/getColorsForName'
import { getTagSlug } from '../../helpers/getTagSlug'
import { NavigableTag } from '../../types/tagTypes'
import { useUserTagVotes } from '../hooks/useUserTagVotes'
import { Link } from './Link'
import { Pie } from './Pie'
import { TextSuperScript } from './TextSuperScript'

export type TagButtonTagProps = {
  type?: string
  name?: string
  slug?: string
  icon?: Exclude<Tag['icon'], null>
  rgb?: Exclude<Tag['rgb'], null>
  score?: number
  rank?: number
  rating?: number
}

export const getTagButtonProps = (
  tag?: TagButtonTagProps | NavigableTag | TagQuery | null
): TagButtonProps => {
  return {
    name: tag ? tagDisplayName(tag as any) : '',
    type: tag?.type as TagType,
    icon: tag?.icon ?? '',
    ...(tag && {
      rgb: Array.isArray(tag.rgb) ? tag.rgb : tag.rgb?.(),
      slug: tag.slug ?? '',
    }),
    ...(tag &&
      'rank' in tag && {
        rank: tag.rank,
        score: tag.score,
        rating: tag.rating,
      }),
  }
}

export type TagButtonProps = StackProps &
  Omit<TagButtonTagProps, 'rgb'> & {
    rgb?: [number, number, number]
    slug?: string
    restaurantSlug?: string
    size?: 'lg' | 'md' | 'sm'
    votable?: boolean
    closable?: boolean
    onClose?: Function
    color?: any
    hideIcon?: boolean
    subtleIcon?: boolean
    fontSize?: TextProps['fontSize']
    fontWeight?: TextProps['fontWeight']
    noColor?: boolean
    replace?: boolean
    replaceSearch?: boolean
    after?: any
    floating?: boolean
    hideRating?: boolean
    hideRank?: boolean
    ratingStyle?: 'points' | 'pie'
  }

const typeColors = {
  lense: purple,
  dish: red,
  filter: blue,
  category: green,
  country: orange,
}

export const TagButton = memo((props: TagButtonProps) => {
  const {
    rank,
    name,
    type,
    size,
    slug,
    rating = 0,
    noColor,
    floating,
    closable,
    onClose,
    replaceSearch,
    votable,
    fontSize: fontSizeProp,
    fontWeight,
    color,
    backgroundColor,
    icon,
    rgb,
    score,
    subtleIcon,
    hideIcon,
    after,
    replace,
    onPress,
    hoverStyle,
    restaurantSlug,
    hideRating,
    hideRank,
    ratingStyle = 'pie',
    ...rest
  } = props

  if (!slug) {
    return null
  }

  const isSmall = size === 'sm'
  const scale = isSmall ? 0.85 : size == 'lg' ? 1.3 : 1
  const colors = getColorsForColor(type ? typeColors[type] ?? green : green)
  const bg = backgroundColor ?? colors.lightColor
  const fg = color ?? colors.color
  const fontSize = fontSizeProp ? fontSizeProp : 15 * scale
  const smallerFontSize: any = typeof fontSize === 'number' ? fontSize * 0.85 : fontSize

  const ratingPts = rating * 10 - 50

  const contents = (
    <HStack
      className="ease-in-out-faster"
      height={isSmall ? 28 : 34}
      borderRadius={isSmall ? 8 : 10}
      paddingHorizontal={isSmall ? 4 : 8}
      overflow="hidden"
      alignItems="center"
      justifyContent="center"
      backgroundColor={bg}
      position="relative"
      // used again down below
      minHeight={isSmall ? 22 : 26}
      hoverStyle={{
        backgroundColor: `${colors.lightColor}99`,
      }}
      {...rest}
    >
      <Spacer size={5} />
      {!hideRank && !!rank && (
        <Text
          fontSize={smallerFontSize}
          fontWeight="500"
          paddingHorizontal={6 * scale}
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          display="flex"
          color={fg}
        >
          <TextSuperScript fontWeight="300" opacity={0.5}>
            #
          </TextSuperScript>
          {rank}
        </Text>
      )}
      {hideIcon ? (
        <>&nbsp;</>
      ) : !!icon ? (
        icon.startsWith('http') ? (
          <Image
            source={{ uri: icon }}
            style={{
              width: fontSize,
              height: fontSize,
              borderRadius: 1000,
              display: isWeb ? ('inline-flex' as any) : 'flex',
              marginVertical: -2,
            }}
          />
        ) : (
          <Text>{icon}</Text>
        )
      ) : null}

      <VStack width={7 * scale} />

      <Text
        ellipse
        fontSize={fontSize}
        fontWeight={fontWeight ?? '600'}
        lineHeight={isSmall ? 22 : 26}
        color={fg}
        {...(floating && {
          textShadowColor: 'rgba(0,0,0,0.4)',
          textShadowOffset: { height: 1, width: 0 },
          textShadowRadius: 3,
        })}
      >
        {name}
      </Text>

      <VStack width={7 * scale} />

      {/*
{!!score && (
        <Text
          color={fg}
          marginLeft={4}
          fontWeight="300"
          fontSize={smallerFontSize}
          opacity={0.8}
        >
          {numberFormat(score ?? 0)}
        </Text>
      )} */}

      {!hideRating && typeof rating !== 'undefined' && (
        <VStack
          position="relative"
          {...(ratingStyle === 'pie' && {
            transform: [{ rotate: `${(1 - rating / 10) * 180}deg` }],
          })}
        >
          {ratingStyle === 'pie' ? (
            <Pie
              size={size === 'sm' ? 16 : 18}
              percent={rating * 10}
              color={floating ? `#fff` : `${colors.color}`}
            />
          ) : (
            <Text color={colors.color} fontSize={13} fontWeight="900" letterSpacing={-0.5}>
              {ratingPts < 0 ? ratingPts : `+${ratingPts}`}
            </Text>
          )}
        </VStack>
      )}

      {!!votable && !!props.restaurantSlug && (
        <>
          <Spacer size="xs" />
          <TagButtonVote
            key={getTagSlug(props.slug) + props.restaurantSlug}
            {...props}
            color={fg}
            scale={scale}
          />
        </>
      )}

      {!!after && (
        <Text marginLeft={4} fontWeight="300" fontSize={smallerFontSize}>
          {after}
        </Text>
      )}
      {!!closable && (
        <VStack onPress={prevent} onPressIn={prevent} onPressOut={onClose as any}>
          <VStack
            backgroundColor="transparent"
            borderRadius={10}
            opacity={0.35}
            marginLeft={-10}
            position="relative"
            width={isWeb ? 26 : 40}
            height={isWeb ? 26 : 40}
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
          >
            <X size={13} color={color} />
          </VStack>
        </VStack>
      )}

      {!closable && !votable && <Spacer size={6} />}
    </HStack>
  )

  return (
    <Link
      {...(onPress && {
        onPress,
      })}
      {...(slug && {
        tag: { slug },
      })}
      replace={replace}
      replaceSearch={replaceSearch}
    >
      {contents}
    </Link>
  )
})

const TagButtonVote = (props: TagButtonProps & { scale: number }) => {
  const { scale } = props
  const { vote, setVote } = useUserTagVotes(props.restaurantSlug ?? '', {
    [getTagSlug(props.slug)]: true,
  })
  const Icon = vote ? ThumbsDown : ThumbsUp
  const color = props.color ?? 'rgba(0,0,0,0.7)'
  const iconProps = {
    size: 12 * scale,
    color,
  }

  return (
    <>
      <VStack
        paddingHorizontal={3 * scale}
        alignItems="center"
        justifyContent="center"
        borderRadius={100}
        width={24 * scale}
        height={24 * scale}
        marginRight={5 * scale}
        opacity={0.6}
        hoverStyle={{
          opacity: 1,
          transform: [{ scale: 1.1 }],
        }}
        onPressIn={prevent}
        onPress={(e) => {
          prevent(e)
          setVote(vote == 0 ? 1 : vote === -1 ? 0 : -1)
        }}
      >
        {vote === 0 && <Icon {...iconProps} />}
        {vote !== 0 && (
          <VStack
            width={24 * scale}
            height={24 * scale}
            backgroundColor={color}
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="#fff" fontSize={12 * scale} fontWeight="600">
              {vote < 0 ? vote : `+${vote}`}
            </Text>
          </VStack>
        )}
      </VStack>
    </>
  )
}
