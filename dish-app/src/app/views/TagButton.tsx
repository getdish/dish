// TODO if we can have compiler pick up a few more things speeds will go up a lot
import { Tag, TagQuery, TagType, graphql } from '@dish/graph'
import { ThumbsDown, ThumbsUp, X } from '@dish/react-feather'
import React, { memo } from 'react'
import {
  AbsoluteVStack,
  Button,
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
import { NavigableTag } from '../../types/tagTypes'
import { useUserTagVotes } from '../hooks/useUserTagVotes'
import { Image } from './Image'
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
    theme?: ThemeName
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
  lense: 'purple',
  dish: 'red',
  filter: 'blue',
  category: 'green',
  country: 'orange',
}

export const TagButton = memo((props: TagButtonProps) => {
  const themeName = useThemeName()
  const color = (props.type && typeColors[props.type]) || 'green'
  const next = props.theme || themeName.includes('dark') ? `${color}-dark` : color
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
    noColor,
    floating,
    closable,
    onClose,
    replaceSearch,
    votable,
    fontSize: fontSizeProp,
    fontWeight,
    color,
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

  const theme = useTheme()

  if (!slug) {
    return null
  }

  const isSmall = size === 'sm'
  const scale = isSmall ? 0.85 : size == 'lg' ? 1.025 : 1
  const fontSize = fontSizeProp ? fontSizeProp : Math.round(15 * scale)
  const smallerFontSize: any = typeof fontSize === 'number' ? Math.round(fontSize * 0.85) : fontSize
  const ratingPts = typeof rating === 'number' ? rating * 10 - 50 : 0
  const pieSize = size === 'sm' ? 16 : 20
  const showRank = !hideRank && !!rank

  const contents = (
    // @ts-expect-error
    <Button
      noTextWrap
      spacing={fontSize * 0.8}
      // className="ease-in-out-faster"
      // height={isSmall ? 28 : 34}
      backgroundColor="transparent"
      paddingHorizontal={isSmall ? 2 : 12}
      hoverStyle={{
        backgroundColor: 'transparent',
      }}
      paddingVertical={isSmall ? 3 : 5}
      height={isSmall ? 32 : 38}
      {...rest}
    >
      {showRank && (
        <Text
          fontSize={smallerFontSize}
          fontWeight="700"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
          display="flex"
          color={theme.color}
          letterSpacing={-1}
          marginRight={-3}
        >
          <Text fontWeight="300" opacity={0.5}>
            #
          </Text>
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

      <Text
        ellipse
        fontSize={fontSize}
        fontWeight={fontWeight || '700'}
        lineHeight={isSmall ? 22 : 26}
        color={color || theme.color}
        borderBottomColor={theme.backgroundColor}
        borderBottomWidth={1}
        opacity={0.8}
        marginTop={-1}
        {...(floating && {
          color: '#fff',
          textShadowColor: 'rgba(0,0,0,0.4)',
          textShadowOffset: { height: 1, width: 0 },
          textShadowRadius: 3,
        })}
        hoverStyle={{
          opacity: 1,
        }}
      >
        {name}
      </Text>

      {!hideRating && typeof rating !== 'undefined' && (
        <>
          {ratingStyle === 'pie' && (
            <VStack
              position="relative"
              backgroundColor={theme.backgroundColorQuartenary}
              borderRadius={100}
              width={pieSize}
              height={pieSize}
              transform={[{ rotate: `${(1 - rating / 10) * 180}deg` }]}
              // borderWidth={1}
              borderColor={theme.backgroundColorAlt}
            >
              <AbsoluteVStack opacity={floating ? 1 : 0.7} fullscreen>
                <Pie size={pieSize} percent={rating * 10} color={floating ? `#fff` : theme.color} />
              </AbsoluteVStack>
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

      {!!votable && !!props.restaurantSlug && (
        <TagButtonVote
          key={getTagSlug(props.slug) + props.restaurantSlug}
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
          marginLeft={-10}
          position="relative"
          width={isWeb ? 26 : 40}
          height={isWeb ? 26 : 40}
          alignItems="center"
          justifyContent="center"
          alignSelf="center"
        >
          <X size={13} color={theme.color} />
        </VStack>
      )}
    </Button>
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
      asyncClick
    >
      {contents}
    </Link>
  )
}

const TagButtonVote = graphql(
  (props: TagButtonProps & { scale: number }) => {
    const { scale } = props
    const { vote, setVote } = useUserTagVotes(props.restaurantSlug ?? '', {
      [getTagSlug(props.slug)]: true,
    })
    const Icon = vote ? ThumbsDown : ThumbsUp
    const color = props.color ?? 'rgba(0,0,0,0.7)'
    const iconProps = {
      size: 14 * scale,
      color,
    }

    return (
      <VStack
        backgroundColor="rgba(0,0,0,0.15)"
        alignItems="center"
        justifyContent="center"
        borderRadius={100}
        width={32 * scale}
        height={32 * scale}
        marginVertical={-2 * scale}
        opacity={0.8}
        hoverStyle={{
          opacity: 1,
          transform: [{ scale: 1.1 }],
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
