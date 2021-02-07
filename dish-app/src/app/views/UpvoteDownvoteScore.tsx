import { supportsTouchWeb } from '@dish/helpers/src'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { memo, useState } from 'react'
import {
  AbsoluteVStack,
  HStack,
  StackProps,
  Text,
  Tooltip,
  VStack,
} from 'snackui'

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
    const [hovered, setHovered] = useState(false)
    const shownScore = Math.round(ratio ? ratio * 100 : score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.65 : 1
    const sizePx = 46 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    const fontSize =
      Math.min(16, sizePx / `${shownScore}`.length) * scale * 1.175 +
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
          isWeb && !supportsTouchWeb && showVoteOnHover ? ' show-on-hover' : ''
        }
        width={sizePx}
        height={sizePx}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.125)"
        shadowRadius={6}
        shadowOffset={{ height: 3, width: -1 }}
        borderRadius={1000}
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
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
              width={3}
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
          fontWeight="900"
          marginVertical={-2 * scale}
          letterSpacing={-0.5}
          color={color}
          textAlignVertical="top"
        >
          {ratio && !hovered ? (
            <HStack alignItems="flex-start">
              <Text>{shownScore}</Text>
              <Text marginRight={-3} fontSize={8} opacity={0.5}>
                %
              </Text>
            </HStack>
          ) : (
            score ?? ''
          )}
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
