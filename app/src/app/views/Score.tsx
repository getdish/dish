import { supportsTouchWeb } from '@dish/helpers'
import { ArrowDown, ArrowUp } from '@dish/react-feather'
import React, { memo } from 'react'
import { HStack, Paragraph } from 'snackui'
import { AbsoluteVStack, StackProps, Text, Tooltip, VStack, useTheme } from 'snackui'

import { green, grey, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { isTouchDevice } from '../../constants/platforms'
import { getColorsForColor } from '../../helpers/getColorsForName'
import { numberFormat } from '../../helpers/numberFormat'
import { ProgressRing } from '../home/ProgressRing'
import { useUserStore } from '../userStore'
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
    const userStore = useUserStore()
    const voteButtonColor = subtle ? '#ccc' : '#999'
    const scale = size === 'sm' ? 0.5 : 1
    const sizePx = 53 * scale
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    const fontSize = Math.round(22 * scale + (size === 'sm' ? 2 : 0))

    let voteContent: any = null

    // disable voting on touch device directly on score
    if (votable && !isTouchDevice && userStore.isLoggedIn) {
      const upvote = (
        <VoteButton
          size={22 * scale}
          Icon={ArrowUp}
          shadowDirection="up"
          voted={vote == 1}
          color={vote === 1 ? 'green' : voteButtonColor}
          backgroundColor="transparent"
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
          backgroundColor="transparent"
          onPress={(e) => {
            e.stopPropagation()
            setVote?.(vote == -1 ? 0 : -1)
          }}
        />
      )
      voteContent = (
        <>
          <VStack>
            {subtle ? (
              upvote
            ) : (
              <Tooltip position="right" contents={upTooltip ?? 'Upvote'} {...isOpenProp}>
                {upvote}
              </Tooltip>
            )}
            {subtle ? (
              downvote
            ) : (
              <Tooltip position="right" contents={downTooltip ?? 'Downvote'} {...isOpenProp}>
                {downvote}
              </Tooltip>
            )}
          </VStack>
        </>
      )
    }

    const theme = useTheme()

    const colors = getColorsForColor(
      typeof rating === 'number' ? (rating >= 7 ? green : rating < 5 ? red : grey) : grey
    )

    return (
      <HStack
        position="relative"
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
        {typeof rating === 'number' && (
          <VStack position="relative">
            <AbsoluteVStack fullscreen alignItems="center" justifyContent="center">
              <Paragraph fontSize={fontSize} fontWeight="700" letterSpacing={-1}>
                {numberFormat(score, 'sm')}
              </Paragraph>
            </AbsoluteVStack>
            <ProgressRing
              size={Math.round(sizePx + 3)}
              color={colors.color400}
              percent={rating * 10}
              width={sizePx * 0.06}
            />
          </VStack>
        )}

        {voteContent}
      </HStack>
    )
  }
)
