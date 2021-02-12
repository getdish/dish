import { supportsTouchWeb } from '@dish/helpers/src'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, StackProps, Text, Tooltip, VStack } from 'snackui'

import { green, grey, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { getColorsForColor } from '../../helpers/getColorsForName'
import { numberFormat } from '../../helpers/numberFormat'
import { Pie } from './Pie'
import { VoteButton } from './VoteButton'

type Props = StackProps & {
  score: number
  showVoteOnHover?: boolean
  size?: 'sm' | 'md'
  rating?: number
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
    rating,
    vote = 0,
    upTooltip,
    downTooltip,
    subtle,
    setVote,
    size,
    ...props
  }: Props) => {
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.65 : 1
    const sizePx = 53 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    const fontSize = Math.round(16 * scale * 1.175 + (size === 'sm' ? 2 : 0))

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

    const colors = getColorsForColor(
      typeof rating === 'number'
        ? rating >= 7
          ? green
          : rating < 5
          ? red
          : grey
        : grey
    )

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
        {...props}
      >
        <AbsoluteVStack top={-15}>
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
        </AbsoluteVStack>
        <AbsoluteVStack bottom={-15}>
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
        </AbsoluteVStack>
        {typeof rating === 'number' && (
          <AbsoluteVStack
            fullscreen
            transform={[{ rotate: `${(1 - rating / 10) * 180}deg` }]}
          >
            <Pie
              size={sizePx}
              color={colors.lightColor}
              percent={rating * 10}
            />
          </AbsoluteVStack>
        )}
        <Text
          fontSize={fontSize}
          fontWeight="600"
          marginVertical={-2 * scale}
          letterSpacing={-1}
          color={`${colors.darkColor}99`}
          textAlignVertical="top"
          zIndex={100}
        >
          {numberFormat(score, 'sm')}
        </Text>
      </VStack>
    )
  }
)
