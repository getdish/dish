import { supportsTouchWeb } from '@dish/helpers/src'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, StackProps, Text, Tooltip, VStack } from 'snackui'

import { green, orange, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import CircularProgress from './CircularProgress'
import { VoteButton } from './VoteButton'

type Props = StackProps & {
  score: number
  showVoteOnHover?: boolean
  size?: 'sm' | 'md'
  ratio?: number
  vote?: -1 | 0 | 1
  setVote?: (next: -1 | 1 | 0) => any
  subtle?: boolean
  upTooltip?: string
  downTooltip?: string
}

export const UpvoteDownvoteScore = memo(
  ({
    score,
    showVoteOnHover,
    ratio,
    vote = 0,
    upTooltip,
    downTooltip,
    subtle,
    setVote,
    size,
    ...props
  }: Props) => {
    score = Math.round(score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.65 : 1
    const sizePx = 56 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    const fontSize =
      Math.min(16, sizePx / `${score}`.length) * scale * 1.075 +
      (size === 'sm' ? 2 : 0)

    const upvote = (
      <VoteButton
        size={18 * scale}
        Icon={ChevronUp}
        shadowDirection="up"
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

    const color =
      typeof ratio == 'undefined'
        ? score >= 0
          ? green
          : red
        : ratio < 0.4
        ? red
        : ratio < 0.6
        ? orange
        : green

    return (
      <VStack
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        className={
          isWeb && !supportsTouchWeb && showVoteOnHover
            ? ' show-vote-on-hover'
            : ''
        }
        width={sizePx}
        height={sizePx}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.125)"
        shadowRadius={6}
        shadowOffset={{ height: 3, width: -1 }}
        borderRadius={1000}
        {...props}
      >
        {typeof ratio === 'number' && (
          <AbsoluteVStack
            fullscreen
            opacity={0.8}
            // transform={[{ scale: 0.95 }]}
          >
            <CircularProgress
              fill={ratio * 100}
              size={sizePx}
              width={2}
              tintColor={color}
              lineCap="round"
              // arcSweepAngle={180}
              rotation={(1 - ratio) * 180}
            />
          </AbsoluteVStack>
        )}
        {subtle ? (
          upvote
        ) : (
          <Tooltip
            position="right"
            contents={upTooltip ?? 'Upvote'}
            {...isOpenProp}
          >
            {upvote}
          </Tooltip>
        )}
        <Text
          fontSize={fontSize}
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
          <Tooltip
            position="right"
            contents={downTooltip ?? 'Downvote'}
            {...isOpenProp}
          >
            {downvote}
          </Tooltip>
        )}
      </VStack>
    )
  }
)
