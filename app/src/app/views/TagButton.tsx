import { Tag, TagQuery, TagType, graphql } from '@dish/graph'
import { Circle, Plus, X } from '@dish/react-feather'
import React, { memo, useRef } from 'react'
import {
  AbsoluteVStack,
  Box,
  HStack,
  HoverablePopover,
  HoverablePopoverProps,
  HoverablePopoverRef,
  StackProps,
  Text,
  TextProps,
  Theme,
  ThemeName,
  Tooltip,
  VStack,
  prevent,
  useTheme,
  useThemeName,
} from 'snackui'

import { blue } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { tagDisplayName } from '../../constants/tagDisplayName'
import { getTagSlug } from '../../helpers/getTagSlug'
import { RGB } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { VoteNumber, useUserTagVotes } from '../hooks/useUserTagVotes'
import { SearchTagButton } from './dish/SearchTagButton'
import { Image } from './Image'
import { Link } from './Link'
import { LinkButton } from './LinkButton'
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
    tooltip?: string
    circular?: boolean
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
    tooltip,
    children,
    circular,
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
      <Text pointerEvents="none" color={theme.color} fontSize={11} fontWeight="300" opacity={0.5}>
        #
      </Text>
      <Text
        pointerEvents="none"
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
      <Text pointerEvents="none" fontSize={16} marginRight={-2} marginLeft={isSmall ? 2 : 5}>
        {icon}
      </Text>
    )

  let contents = (
    <HStack
      className="hover-parent"
      position="relative"
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
      {...(circular && {
        height: 44,
        width: 44,
        borderRadius: 1000,
      })}
      {...rest}
    >
      {rankElement}
      {iconElement}

      {!onlyIcon && !circular && (
        <Text
          ellipse
          fontSize={fontSize}
          fontWeight={fontWeight || '400'}
          lineHeight={isSmall ? 15 : 22}
          color={color || theme.color}
          pointerEvents="none"
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
            <VStack marginVertical={-2} position="relative">
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
        <VStack
          {...(noLink && {
            position: 'absolute',
            scale: 0.9,
            bottom: -6,
            right: -8,
          })}
        >
          <TagButtonVote
            key={slug + props.restaurantSlug}
            {...props}
            color={theme.color}
            scale={scale}
            disablePopover={noLink}
          />
        </VStack>
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

  if (tooltip) {
    contents = <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  // make entire button votable in this case
  if (noLink && votable) {
    // @ts-ignore
    return <TagVotePopover {...props}>{contents}</TagVotePopover>
  }

  return contents
}

const TagVotePopover = graphql(
  ({
    slug,
    restaurantSlug,
    ...popoverProps
  }: HoverablePopoverProps & {
    slug?: string
    restaurantSlug?: string
  }) => {
    const hovPopRef = useRef<HoverablePopoverRef>()
    const tagSlug = getTagSlug(slug)
    const { vote, setVote } = useUserTagVotes(restaurantSlug || '', {
      [tagSlug]: true,
    })
    return (
      <HoverablePopover
        // @ts-ignore
        ref={hovPopRef}
        allowHoverOnContent
        anchor="CENTER"
        animated={false}
        {...popoverProps}
        contents={
          <Theme name="dark">
            <Box paddingVertical={1} paddingHorizontal={1} borderRadius={80}>
              <HStack>
                {tagRatings.map((rating) => (
                  <LinkButton
                    promptLogin
                    borderRadius={1000}
                    width={38}
                    height={38}
                    paddingHorizontal={0}
                    textProps={{
                      letterSpacing: -1,
                      fontWeight: '600',
                      paddingHorizontal: 4,
                    }}
                    onPress={(e) => {
                      e.stopPropagation()
                      setVote(rating)
                      // give time to see it update
                      setTimeout(() => {
                        hovPopRef.current?.close()
                      }, 200)
                    }}
                    key={rating}
                    {...(vote === rating
                      ? {
                          backgroundColor: blue,
                        }
                      : {
                          backgroundColor: 'transparent',
                        })}
                  >
                    {rating}
                  </LinkButton>
                ))}
              </HStack>
            </Box>
          </Theme>
        }
      />
    )
  },
  {
    suspense: false,
  }
)

const TagButtonVote = graphql(
  (props: TagButtonProps & { scale: number; disablePopover?: boolean }) => {
    const { scale } = props
    const tagSlug = getTagSlug(props.slug)
    const { vote } = useUserTagVotes(props.restaurantSlug || '', {
      [tagSlug]: true,
    })
    const theme = useTheme()
    const iconProps = {
      size: 14,
      color: 'rgba(150,150,150,0.25)',
    }
    const contents = (
      <VStack
        alignItems="center"
        pointerEvents="auto"
        zIndex={100}
        position="relative"
        justifyContent="center"
        borderRadius={100}
        width={50 * scale}
        height={50 * scale}
        marginVertical={-10 * scale}
        marginHorizontal={-10 * scale}
        marginRight={-15 * scale}
        opacity={0.8}
      >
        {!props.disablePopover && vote === 0 && <Circle {...iconProps} />}
        {vote !== 0 && (
          <VStack
            width={28 * scale}
            height={28 * scale}
            backgroundColor={theme.backgroundColor}
            borderRadius={100}
            alignItems="center"
            justifyContent="center"
            pointerEvents="none"
          >
            <Text color={theme.color} fontSize={14 * scale} fontWeight="800">
              {vote < 0 ? vote : `${vote}`}
            </Text>
          </VStack>
        )}
      </VStack>
    )

    if (props.disablePopover) {
      return contents
    }

    // @ts-ignore
    return <TagVotePopover {...props}>{contents}</TagVotePopover>
  },
  {
    suspense: false,
  }
)

const tagRatings = [1, 2, 3, 4, 5] as VoteNumber[]
