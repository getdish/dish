import { Tag, TagQuery, TagType, graphql, restaurant, review } from '@dish/graph'
import {
  AbsoluteYStack,
  Box,
  HoverablePopover,
  HoverablePopoverHandle,
  HoverablePopoverProps,
  StackProps,
  Text,
  TextProps,
  Theme,
  ThemeName,
  Tooltip,
  XStack,
  YStack,
  prevent,
  useTheme,
  ButtonProps,
  getFontSize,
  Button,
  Paragraph,
} from '@dish/ui'
import { X } from '@tamagui/feather-icons'
import React, { memo, useRef } from 'react'

import { light } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { tagDisplayName } from '../../constants/tagDisplayName'
import { getTagSlug } from '../../helpers/getTagSlug'
import { RGB } from '../../helpers/rgb'
import { NavigableTag } from '../../types/tagTypes'
import { useUserTagVotes } from '../hooks/useUserTagVotes'
import { SearchTagButton } from './dish/SearchTagButton'
import { Image } from './Image'
import { Link } from './Link'
import { LinkButton } from './LinkButton'
import { Pie } from './Pie'
import { TagButtonVote, tagRatings } from './TagButtonVote'

export type TagButtonTagProps = {
  type?: string
  name?: string
  slug?: string
  icon?: Exclude<Tag['icon'], null>
  rgb?: Exclude<Tag['rgb'], null>
  score?: number
  rank?: number
  rating?: number
  vote?: number
}

type TagLike = TagButtonTagProps | NavigableTag | TagQuery

const getTagProps = (tag: TagLike) => {
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

export const getTagButtonProps = (review_or_tag?: TagLike | review | null): TagButtonProps => {
  if (!review_or_tag) {
    return {
      name: '',
    }
  }
  const review = review_or_tag as review
  if (review.tag) {
    // is a review
    return {
      ...getTagProps(review.tag),
      vote: review.vote,
    }
  }
  return getTagProps(review_or_tag as any)
}

export type TagButtonProps = Omit<ButtonProps, 'icon'> &
  Omit<TagButtonTagProps, 'rgb'> & {
    after?: any
    bordered?: boolean
    circular?: boolean
    closable?: boolean
    color?: any
    fadeLowlyVoted?: boolean
    floating?: boolean
    fontSize?: TextProps['fontSize']
    fontWeight?: TextProps['fontWeight']
    hideIcon?: boolean
    hideRank?: boolean
    hideRating?: boolean
    hideVote?: boolean
    isActive?: boolean
    noLink?: boolean
    onClose?: () => void
    onlyIcon?: boolean
    ratingStyle?: 'points' | 'pie'
    refetchKey?: string
    replace?: boolean
    replaceSearch?: boolean
    restaurant?: restaurant | null
    showSearchButton?: boolean
    slug?: string
    subtleIcon?: boolean
    theme?: ThemeName
    tooltip?: string
    transparent?: boolean
    votable?: boolean
  }

const typeColors = {
  lense: 'purple',
  dish: 'red',
  filter: 'blue',
  category: 'green',
  country: 'orange',
}

export const TagButton = memo((props: TagButtonProps) => {
  const color = (props.type && typeColors[props.type]) || 'green'
  return (
    <Theme name={color as any}>
      <TagButtonInner {...props} />
    </Theme>
  )
})

const TagButtonInner = (props: TagButtonProps) => {
  const {
    after,
    bordered,
    children,
    circular,
    closable,
    color,
    fadeLowlyVoted,
    floating,
    fontSize: fontSizeProp,
    fontWeight,
    hideIcon,
    hideRank,
    hideRating,
    hideVote,
    icon,
    isActive,
    name,
    noLink,
    onClose,
    onlyIcon,
    rank,
    rating,
    ratingStyle = 'pie',
    replace,
    replaceSearch,
    restaurant,
    score,
    showSearchButton,
    size = '$4',
    slug,
    subtleIcon,
    tooltip,
    transparent,
    type,
    votable,
    ...rest
  } = props

  const theme = useTheme()
  const ratingPts = typeof rating === 'number' ? rating * 10 - 50 : 0
  const fontSize = getFontSize(size as any)
  const smallerFontSize = getFontSize(size as any, { relativeSize: -1 })
  const showRank = !hideRank

  const rankElement = !onlyIcon && showRank && (
    <XStack
      alignItems="flex-start"
      flexWrap="nowrap"
      flexShrink={0}
      opacity={rank && rank < 100 ? 1 : 0}
    >
      <Text pointerEvents="none" color={theme.color} fontSize={7} fontWeight="300" opacity={0.15}>
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
        letterSpacing={-1.5}
        opacity={0.2}
      >
        {rank}
      </Text>
    </XStack>
  )

  const iconElement =
    hideIcon || !icon ? null : icon.startsWith('http') ? (
      <Image
        source={{ uri: icon }}
        style={{
          width: fontSize.toString(),
          height: fontSize.toString(),
          borderRadius: 1000,
          display: isWeb ? ('inline-flex' as any) : 'flex',
          marginVertical: -2,
        }}
      />
    ) : (
      <Text pointerEvents="none" fontSize={fontSize}>
        {icon}
      </Text>
    )

  // allows for controlled or user-controlled... not pretty
  const tagSlug = getTagSlug(slug)
  const userTagVotes = useUserTagVotes({
    ...props,
    activeTags: [tagSlug],
  })

  const vote =
    (userTagVotes.didVoteDuringSession && props.votable) || !('vote' in props)
      ? userTagVotes.vote
      : props.vote

  let contents = (
    <Button
      size={size}
      className="hover-parent"
      position="relative"
      noTextWrap
      backgroundColor={theme.bg}
      icon={iconElement}
      {...(fadeLowlyVoted &&
        typeof vote === 'number' &&
        vote <= 2 && {
          opacity: 0.4,
        })}
      {...rest}
    >
      {rankElement}

      {!hideRating && typeof rating !== 'undefined' && (
        <>
          {ratingStyle === 'pie' && (
            <YStack marginVertical={-2} position="relative">
              {/* {rating === 0 ? null : rating * 10 < 18 ? (
                <Text fontSize={16}>😕</Text>
              ) : rating * 10 > 90 ? (
                <Text fontSize={16}>💎</Text>
              ) : ( */}
              <YStack
                position="relative"
                backgroundColor={theme.bg4}
                borderRadius={100}
                width={fontSize}
                height={fontSize}
                transform={[{ rotate: `${(1 - rating / 10) * 180}deg` }]}
                // borderWidth={1}
                borderColor={theme.bg3}
                opacity={floating ? 1 : 0.7}
              >
                <Pie
                  size={fontSize}
                  percent={rating * 10}
                  color={floating ? `#fff` : theme.color.toString()}
                />
              </YStack>
              {/* )} */}
            </YStack>
          )}

          {ratingStyle !== 'pie' && (
            <YStack position="relative" backgroundColor={floating ? `#fff` : theme.color}>
              <Text color={theme.color} fontSize={13} fontWeight="900" letterSpacing={-0.5}>
                {ratingPts < 0 ? ratingPts : `+${ratingPts}`}
              </Text>
            </YStack>
          )}
        </>
      )}

      {!onlyIcon && !circular && (
        <Paragraph
          ellipse
          size={size}
          fontWeight={fontWeight || '400'}
          paddingLeft={3}
          color={color || theme.color}
          pointerEvents="none"
          {...(floating && {
            color: '#fff',
            textShadowColor: theme.shadowColor2,
            textShadowOffset: { height: 3, width: 0 },
            textShadowRadius: 3,
          })}
          hoverStyle={{
            opacity: 1,
          }}
        >
          {tagDisplayName(name)}
        </Paragraph>
      )}

      {children}

      {(hideVote && !vote ? false : true) && !!slug && !!votable && !!props.restaurant && (
        <TagButtonVote
          {...props}
          vote={vote}
          key={`${slug}${props.restaurant?.slug}${userTagVotes.vote}`}
          color={theme.color}
          scale={Math.round(+fontSize / 16)}
          disablePopover={noLink}
        />
      )}

      {!!after && (
        <Text color={theme.color} fontWeight="300" fontSize={smallerFontSize}>
          {after}
        </Text>
      )}

      {!!closable && (
        <YStack
          onPress={prevent}
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
          <X size={13} color={theme.color.toString()} />
        </YStack>
      )}

      {isWeb && showSearchButton && !!slug && (
        <AbsoluteYStack
          className="hover-100-opacity-child"
          opacity={0}
          bottom={-10}
          right={-10}
          scale={0.7}
          hoverStyle={{ scale: 0.75 }}
        >
          <SearchTagButton tag={{ type: 'dish', slug }} color="#000" />
        </AbsoluteYStack>
      )}
    </Button>
  )

  // make entire button votable in this case
  // dont combine with link/tooltip
  const voteOnButton = noLink && votable
  if (voteOnButton) {
    return <TagVotePopover {...props}>{contents}</TagVotePopover>
  }

  if (!noLink) {
    contents = (
      // @ts-ignore
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
    return <Tooltip contents={tooltip}>{contents}</Tooltip>
  }

  return contents
}

export const TagVotePopover = graphql(
  ({
    slug,
    restaurant,
    children,
    ...popoverProps
  }: Omit<Partial<HoverablePopoverProps>, 'placement' | 'style'> & TagButtonProps) => {
    const hovPopRef = useRef<HoverablePopoverHandle>()
    const tagSlug = getTagSlug(slug)
    const { vote, setVote } = useUserTagVotes({
      restaurant,
      activeTags: [tagSlug],
    })

    return (
      <HoverablePopover
        ref={hovPopRef as any}
        allowHoverOnContent
        // fallbackToPress
        placement="top"
        {...popoverProps}
        trigger={(props) => React.cloneElement(children, props)}
      >
        <Theme name="dark">
          <Box paddingVertical={1} paddingHorizontal={1} borderRadius={80}>
            <XStack>
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
                        backgroundColor: light.blue3,
                      }
                    : {
                        backgroundColor: 'transparent',
                      })}
                >
                  {rating}
                </LinkButton>
              ))}
            </XStack>
          </Box>
        </Theme>
      </HoverablePopover>
    )
  },
  {
    suspense: false,
  }
)
