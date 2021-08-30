import { Tag, TagQuery, TagType, graphql } from '@dish/graph'
import { ThumbsDown, ThumbsUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import {
  AbsoluteVStack,
  HStack,
  Spacer,
  StackProps,
  Text,
  TextProps,
  Theme,
  ThemeName,
  VStack,
  prevent,
  useTheme,
  useThemeName,
} from 'snackui'

import { isWeb } from '../../constants/constants'
import { tagDisplayName } from '../../constants/tagDisplayName'
import { getTagSlug } from '../../helpers/getTagSlug'
import { RGB } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { useUserTagVotes } from '../hooks/useUserTagVotes'
import { SearchTagButton } from './dish/SearchTagButton'
import { Image } from './Image'
import { Link } from './Link'
import { Pie } from './Pie'

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
  if (!tag) {
    return {
      name: '',
    }
  }
  return {
    name: tagDisplayName(tag as any),
    type: tag.type as TagType,
    icon: tag.icon ?? '',
    rgb: Array.isArray(tag.rgb) ? tag.rgb : tag.rgb?.(),
    slug: tag.slug ?? '',
    ...('rank' in tag && {
      rank: tag.rank,
      score: tag.score,
      rating: tag.rating,
    }),
  }
}

export type TagButtonProps = StackProps &
  Omit<TagButtonTagProps, 'rgb'> & {
    noLink?: boolean
    theme?: ThemeName
    rgb?: RGB | null
    slug?: string
    restaurantSlug?: string
    size?: 'lg' | 'md' | 'sm'
    votable?: boolean
    closable?: boolean
    onClose?: Function
    onlyIcon?: boolean
    color?: any
    hideIcon?: boolean
    subtleIcon?: boolean
    fontSize?: TextProps['fontSize']
    fontWeight?: TextProps['fontWeight']
    replace?: boolean
    replaceSearch?: boolean
    after?: any
    floating?: boolean
    hideRating?: boolean
    hideRank?: boolean
    ratingStyle?: 'points' | 'pie'
    transparent?: boolean
    bordered?: boolean
    isActive?: boolean
    showSearchButton?: boolean
  }

const typeColors = {
  lense: 'purple',
  dish: 'red',
  filter: 'blue',
  category: 'green',
  country: 'orange',
}

export const TagButton = memo((props: TagButtonProps) => {
  const themeName = useThemeName()
  const color = (props.type && typeColors[props.type]) || 'green'
  const next = themeName.includes('dark') ? `${color}-dark` : `${color}-light`
  return (
    <Theme name={next}>
      <TagButtonInner {...props} />
    </Theme>
  )
})

const TagButtonInner = (props: TagButtonProps) => {
  const {
    rank,
    name,
    type,
    size,
    slug,
    rating,
    floating,
    closable,
    bordered,
    onClose,
    replaceSearch,
    votable,
    onlyIcon,
    fontSize: fontSizeProp,
    fontWeight,
    color,
    icon,
    rgb,
    score,
    subtleIcon,
    hideIcon,
    isActive,
    after,
    showSearchButton,
    replace,
    restaurantSlug,
    hideRating,
    hideRank,
    ratingStyle = 'pie',
    transparent,
    noLink,
    children,
    ...rest
  } = props

  const theme = useTheme()
  const isSmall = size === 'sm'
  const scale = isSmall ? 0.9 : size == 'lg' ? 1.1 : 1
  const fontSize = fontSizeProp ? fontSizeProp : Math.round(15 * scale)
  const smallerFontSize: any = typeof fontSize === 'number' ? Math.round(fontSize * 0.85) : fontSize
  const ratingPts = typeof rating === 'number' ? rating * 10 - 50 : 0
  const pieSize = size === 'sm' ? 16 : 20
  const showRank = !hideRank && !!rank

  const rankElement = !onlyIcon && showRank && rank && rank < 100 && (
    <>
      <Text fontSize={11} fontWeight="300" opacity={0.5}>
        #
      </Text>
      <Text
        fontSize={smallerFontSize}
        alignContent="center"
        justifyContent="center"
        alignItems="center"
        display="flex"
        color={theme.color}
        letterSpacing={-1}
        marginRight={-3}
        opacity={0.8}
      >
        {rank}
      </Text>
    </>
  )

  const iconElement =
    hideIcon || !icon ? null : icon.startsWith('http') ? (
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
      <Text fontSize={12} marginRight={-2} marginLeft={isSmall ? 2 : 5}>
        {icon}
      </Text>
    )

  let contents = (
    <HStack
      className="hover-parent"
      spacing={fontSize * 0.5}
      borderRadius={8}
      backgroundColor={theme.backgroundColor}
      borderWidth={1}
      borderColor={bordered ? theme.borderColor : 'transparent'}
      hoverStyle={{
        backgroundColor: theme.backgroundColorSecondary,
      }}
      pressStyle={{
        backgroundColor: theme.backgroundColorTertiary,
      }}
      {...(transparent && {
        backgroundColor: 'transparent',
        hoverStyle: {
          backgroundColor: 'transparent',
        },
        pressStyle: {
          backgroundColor: 'transparent',
        },
      })}
      {...(isActive && {
        backgroundColor: theme.cardBackgroundColor,
        hoverStyle: {
          backgroundColor: theme.cardBackgroundColor,
        },
      })}
      alignItems="center"
      justifyContent="center"
      paddingHorizontal={isSmall ? 5 : 10}
      paddingVertical={isSmall ? 3 : 5}
      height={isSmall ? 32 : 38}
      {...rest}
    >
      {!iconElement && !rankElement && <Spacer size="xs" />}

      {rankElement}
      {iconElement}

      {!onlyIcon && (
        <Text
          ellipse
          fontSize={fontSize}
          fontWeight={fontWeight || '400'}
          lineHeight={isSmall ? 13 : 22}
          color={color || theme.color}
          // borderBottomColor={theme.backgroundColor}
          // borderBottomWidth={floating ? 0 : 1}
          opacity={0.8}
          marginTop={-1}
          {...(floating && {
            color: '#fff',
            textShadowColor: theme.shadowColorLighter,
            textShadowOffset: { height: 3, width: 0 },
            textShadowRadius: 3,
          })}
          hoverStyle={{
            opacity: 1,
          }}
        >
          {tagDisplayName(name)}
        </Text>
      )}

      {children}

      {!hideRating && typeof rating !== 'undefined' && (
        <>
          {ratingStyle === 'pie' && (
            <VStack position="relative">
              {rating * 10 < 25 ? (
                <Text fontSize={16}>😕</Text>
              ) : rating * 10 > 90 ? (
                <Text fontSize={16}>💎</Text>
              ) : (
                <VStack
                  position="relative"
                  backgroundColor={theme.backgroundColorQuartenary}
                  borderRadius={100}
                  width={pieSize}
                  height={pieSize}
                  transform={[{ rotate: `${(1 - rating / 10) * 180}deg` }]}
                  // borderWidth={1}
                  borderColor={theme.backgroundColorAlt}
                  opacity={floating ? 1 : 0.7}
                >
                  <Pie
                    size={pieSize}
                    percent={rating * 10}
                    color={floating ? `#fff` : theme.color}
                  />
                </VStack>
              )}
            </VStack>
          )}

          {ratingStyle !== 'pie' && (
            <VStack position="relative" backgroundColor={floating ? `#fff` : theme.color}>
              <Text color={theme.color} fontSize={13} fontWeight="900" letterSpacing={-0.5}>
                {ratingPts < 0 ? ratingPts : `+${ratingPts}`}
              </Text>
            </VStack>
          )}
        </>
      )}

      {!!slug && !!votable && !!props.restaurantSlug && (
        <TagButtonVote
          key={getTagSlug(slug) + props.restaurantSlug}
          {...props}
          color={theme.color}
          scale={scale}
        />
      )}

      {!!after && (
        <Text color={theme.color} fontWeight="300" fontSize={smallerFontSize}>
          {after}
        </Text>
      )}

      {!!closable && (
        <VStack
          onPress={prevent}
          onPressIn={prevent}
          onPressOut={onClose as any}
          backgroundColor="transparent"
          borderRadius={10}
          opacity={0.35}
          position="relative"
          width={isWeb ? 26 : 40}
          height={isWeb ? 26 : 40}
          marginLeft={-5}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
        >
          <X size={13} color={theme.color} />
        </VStack>
      )}

      {isWeb && showSearchButton && !!slug && (
        <AbsoluteVStack
          className="hover-100-opacity-child"
          opacity={0}
          bottom={-10}
          right={-10}
          scale={0.7}
          hoverStyle={{ scale: 0.75 }}
        >
          <SearchTagButton tag={{ type: 'dish', slug }} backgroundColor="#fff" color="#000" />
        </AbsoluteVStack>
      )}
    </HStack>
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
        {...(!rest.onPress &&
          !!slug && {
            tag: { slug },
          })}
      >
        {contents}
      </Link>
    )
  }

  return contents
}

const TagButtonVote = graphql(
  (props: TagButtonProps & { scale: number }) => {
    const { scale } = props
    const { vote, setVote } = useUserTagVotes(props.restaurantSlug ?? '', {
      [getTagSlug(props.slug)]: true,
    })
    const Icon = vote ? ThumbsDown : ThumbsUp
    const color = props.color ?? 'rgba(0,0,0,0.7)'
    const theme = useTheme()
    const iconProps = {
      size: 14 * scale,
      color,
    }

    return (
      <VStack
        backgroundColor={theme.backgroundColorTransluscent}
        alignItems="center"
        justifyContent="center"
        borderRadius={100}
        width={32 * scale}
        height={32 * scale}
        marginVertical={-2 * scale}
        opacity={0.8}
        hoverStyle={{
          opacity: 1,
          backgroundColor: theme.backgroundColorTransluscentHover,
        }}
        pressStyle={{
          opacity: 0.5,
          transform: [{ scale: 0.9 }],
        }}
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
    )
  },
  {
    suspense: false,
  }
)
