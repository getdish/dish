import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { Suspense, memo, useState } from 'react'
import { StyleSheet } from 'react-native'
import {
  AbsoluteVStack,
  HoverablePopover,
  LinearGradient,
  StackProps,
  Text,
  Tooltip,
  VStack,
  prevent,
} from 'snackui'

import { bgLight, green, lightOrange, lightRed } from '../../colors'
import { rgbString } from '../../helpers/rgbString'
import { useCurrentLenseColor } from '../../hooks/useCurrentLenseColor'
import { useIsNarrow } from '../../hooks/useIs'
import { useUserTagVotes } from '../../hooks/useUserTagVotes'
import { HomeActiveTagsRecord } from '../../state/home-types'
import CircularProgress from '../CircularProgress'
import { Link } from '../ui/Link'

type UpvoteDownvoteProps = {
  restaurantId: string
  restaurantSlug: string
  score: number
  ratio: number
  activeTags: HomeActiveTagsRecord
}

export const RestaurantUpVoteDownVote = (props: UpvoteDownvoteProps) => {
  return (
    <Suspense fallback={null}>
      <RestaurantUpVoteDownVoteContents {...props} />
    </Suspense>
  )
}

const RestaurantUpVoteDownVoteContents = memo(
  graphql(function RestaurantUpVoteDownVote({
    restaurantId,
    restaurantSlug,
    score: baseScore,
    ratio,
    activeTags,
  }: UpvoteDownvoteProps) {
    const { vote, setVote } = useUserTagVotes(restaurantSlug, activeTags)
    const score = baseScore + vote
    const rgb = [220, 241, 229]

    return (
      <VStack position="relative">
        <AbsoluteVStack
          top={-20}
          right={-30}
          opacity={0.8}
          // transform={[{ scale: 0.95 }]}
        >
          <CircularProgress
            fill={ratio * 100}
            size={35}
            width={2}
            tintColor={green}
            lineCap="round"
            backgroundColor="#fff"
            rotation={(1 - ratio) * 180}
          >
            {() => <Text fontSize={12}>{Math.round(ratio * 100)}</Text>}
          </CircularProgress>
        </AbsoluteVStack>
        <VStack
          // className="safari-fix-overflow"
          transform={[{ skewX: '-12deg' }]}
        >
          <VStack
            shadowColor="#000"
            backgroundColor="#fff"
            shadowOpacity={0.1}
            shadowRadius={10}
            borderRadius={12}
            width={62}
            overflow="hidden"
            padding={2}
            paddingHorizontal={2}
          >
            <VStack alignItems="flex-end" transform={[{ skewX: '12deg' }]}>
              <TotalScore
                score={score}
                ratio={ratio}
                vote={vote}
                setVote={setVote}
              />
            </VStack>
          </VStack>
        </VStack>
      </VStack>
    )
  })
)

export const TotalScore = memo(
  ({
    score,
    vote,
    subtle,
    setVote,
    size,
    ...props
  }: {
    size?: 'sm' | 'md'
    ratio?: number
    score: number
    vote: -1 | 0 | 1
    setVote?: (vote: number) => void
    subtle?: boolean
  } & StackProps) => {
    score = Math.round(score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.75 : 1
    const sizePx = 50 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }

    const upvote = (
      <VoteButton
        size={18 * scale}
        Icon={ChevronUp}
        voted={vote == 1}
        color={vote === 1 ? 'green' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote === 1 ? 0 : 1)
        }}
      />
    )

    const downvote = (
      <VoteButton
        size={18 * scale}
        Icon={ChevronDown}
        voted={vote == -1}
        color={vote === -1 ? 'red' : voteButtonColor}
        onPress={(e) => {
          e.stopPropagation()
          setVote?.(vote == -1 ? 0 : -1)
        }}
      />
    )

    const color = '#000' //ratio < 0.4 ? lightRed : ratio < 0.6 ? lightOrange : '#fff'

    return (
      <VStack
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        {...props}
      >
        {/* <AbsoluteVStack
          fullscreen
          borderRadius={1000}
          backgroundColor={lightGreen}
          transform={[{ scale: ratio }]}
          zIndex={-1}
        /> */}
        {subtle ? (
          upvote
        ) : (
          <Tooltip position="right" contents="Upvote" {...isOpenProp}>
            {upvote}
          </Tooltip>
        )}
        <Text
          fontSize={Math.min(16, sizePx / `${score}`.length) * scale * 1.075}
          fontWeight="700"
          marginVertical={-2 * scale}
          letterSpacing={-0.5}
          color={color}
        >
          {score ?? ''}
        </Text>
        {subtle ? (
          downvote
        ) : (
          <Tooltip position="right" contents="Downvote" {...isOpenProp}>
            {downvote}
          </Tooltip>
        )}
      </VStack>
    )
  }
)

export const VoteButton = ({
  color,
  Icon,
  size = 18,
  voted,
  hoverColor,
  ...props
}: StackProps & {
  hoverColor?: string
  voted?: boolean
  Icon: any
  color?: string | null
  size?: number
}) => {
  const isSmall = useIsNarrow()
  const scale = isSmall ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  return (
    <VStack
      width={22 * scale}
      height={22 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPressIn={prevent}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...props}
    >
      <Icon
        size={size * (voted ? 1.2 : 1)}
        color={hovered ? hoverColor ?? '#000' : color ?? '#ccc'}
      />
    </VStack>
  )
}
