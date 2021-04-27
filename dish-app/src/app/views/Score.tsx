import { supportsTouchWeb } from '@dish/helpers'
import { ArrowDown, ArrowUp } from '@dish/react-feather'
import React, { memo } from 'react'
import { AbsoluteVStack, StackProps, Text, Tooltip, VStack, useTheme } from 'snackui'

import { green, grey, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { isTouchDevice } from '../../constants/platforms'
import { getColorsForColor } from '../../helpers/getColorsForName'
import { numberFormat } from '../../helpers/numberFormat'
import { ProgressRing } from '../home/ProgressRing'
import { VoteButton } from './VoteButton'

type Props = StackProps & {
  votable?: boolean
  score: number
  showVoteOnHover?: boolean
  size?: 'sm' | 'md'
  rating?: number
  vote?: -1 | 0 | 1
  setVote?: (next: -1 | 1 | 0) => any
  subtle?: boolean
  upTooltip?: string
  downTooltip?: string
  shadowed?: boolean
}

export const Score = memo(
  ({
    score,
    votable,
    showVoteOnHover,
    rating,
    vote = 0,
    upTooltip,
    shadowed,
    downTooltip,
    subtle,
    setVote,
    size,
    ...props
  }: Props) => {
    const voteButtonColor = subtle ? '#ccc' : '#999'
    const scale = size === 'sm' ? 0.65 : 1
    const sizePx = 53 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    const fontSize = Math.round(18 * scale + (size === 'sm' ? 2 : 0))

    let voteContent: any = null

    // disable voting on touch device directly on score
    if (votable && !isTouchDevice) {
      const upvote = (
        <VoteButton
          size={22 * scale}
          Icon={ArrowUp}
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
          size={22 * scale}
          Icon={ArrowDown}
          voted={vote == -1}
          color={vote === -1 ? 'red' : voteButtonColor}
          onPress={(e) => {
            e.stopPropagation()
            setVote?.(vote == -1 ? 0 : -1)
          }}
        />
      )
      voteContent = (
        <>
          <AbsoluteVStack zIndex={-1} top={-20}>
            {subtle ? (
              upvote
            ) : (
              <Tooltip position="right" contents={upTooltip ?? 'Upvote'} {...isOpenProp}>
                {upvote}
              </Tooltip>
            )}
          </AbsoluteVStack>
          <AbsoluteVStack zIndex={-1} bottom={-20}>
            {subtle ? (
              downvote
            ) : (
              <Tooltip position="right" contents={downTooltip ?? 'Downvote'} {...isOpenProp}>
                {downvote}
              </Tooltip>
            )}
          </AbsoluteVStack>
        </>
      )
    }

    const colors = getColorsForColor(
      typeof rating === 'number' ? (rating >= 7 ? green : rating < 5 ? red : grey) : grey
    )

    const theme = useTheme()

    return (
      <VStack
        pointerEvents="auto"
        backgroundColor={theme.cardBackgroundColor}
        alignItems="center"
        justifyContent="center"
        className={isWeb && !supportsTouchWeb && showVoteOnHover ? ' show-on-hover' : ''}
        width={sizePx}
        height={sizePx}
        {...(shadowed && {
          shadowColor: 'rgba(0,0,0,0.125)',
          shadowRadius: 6,
          shadowOffset: { height: 3, width: -1 },
        })}
        borderRadius={1000}
        {...props}
      >
        {voteContent}

        {typeof rating === 'number' && (
          <AbsoluteVStack
            fullscreen
            alignItems="center"
            justifyContent="center"
            // transform={[{ rotate: `${(1 - rating / 10) * 180}deg` }]}
          >
            <ProgressRing
              size={Math.round(sizePx + 3)}
              color={colors.color}
              percent={rating * 10}
              width={sizePx * 0.1}
            />
          </AbsoluteVStack>
        )}

        <VStack
          zIndex={100}
          borderRadius={100}
          width={sizePx * 0.75}
          height={sizePx * 0.75}
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize={fontSize} fontWeight="300" letterSpacing={-1} color="#fff">
            {numberFormat(score, 'sm')}
          </Text>
        </VStack>
      </VStack>
    )
  }
)
