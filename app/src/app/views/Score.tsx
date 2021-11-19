import { supportsTouchWeb } from '@dish/helpers'
import { InteractiveContainer, Paragraph, XStack } from '@dish/ui'
import { AbsoluteYStack, StackProps, Text, Tooltip, YStack, useTheme } from '@dish/ui'
import { ArrowDown, ArrowUp } from '@tamagui/feather-icons'
import React, { memo } from 'react'

import { green, grey, red } from '../../constants/colors'
import { isWeb } from '../../constants/constants'
import { isTouchDevice } from '../../constants/platforms'
import { getColorsForColor } from '../../helpers/getColorsForName'
import { numberFormat } from '../../helpers/numberFormat'
import { ProgressRing } from '../home/ProgressRing'
import { useUserStore } from '../userStore'
import { VoteButton } from './VoteButton'

export type ScoreProps = StackProps & {
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
  }: ScoreProps) => {
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
    const fontSize = Math.round(24 * scale + (size === 'sm' ? 2 : 2))
    const btnSize = (isTouchDevice ? 33 : 22) * scale

    let voteContent: any = null

    // disable voting on touch device directly on score
    if (votable && !isTouchDevice && userStore.isLoggedIn) {
      const getUpvote = (props) => (
        <VoteButton
          {...props}
          size={btnSize}
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
      const getDownvote = (props) => (
        <VoteButton
          {...props}
          size={btnSize}
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
          <InteractiveContainer
            flexWrap="nowrap"
            flexDirection="column"
            height={btnSize * 4.5}
            marginVertical={-4}
          >
            {subtle ? (
              getUpvote({})
            ) : (
              <Tooltip placement="right" trigger={getUpvote} {...isOpenProp}>
                {upTooltip ?? 'Upvote'}
              </Tooltip>
            )}
            {subtle ? (
              getDownvote({})
            ) : (
              <Tooltip placement="right" trigger={getDownvote} {...isOpenProp}>
                {downTooltip ?? 'Downvote'}
              </Tooltip>
            )}
          </InteractiveContainer>
        </>
      )
    }

    const theme = useTheme()

    const colors = getColorsForColor(
      typeof rating === 'number' ? (rating >= 7 ? green : rating < 5 ? red : grey) : grey
    )

    return (
      <XStack
        position="relative"
        pointerEvents="auto"
        alignItems="center"
        spacing="sm"
        justifyContent="center"
        className={isWeb && !supportsTouchWeb && showVoteOnHover ? ' show-on-hover' : ''}
        {...props}
      >
        {typeof rating === 'number' && (
          <YStack
            borderRadius={1000}
            backgroundColor={theme.cardBackgroundColor}
            height={sizePx}
            position="relative"
            {...(shadowed && {
              shadowColor: 'rgba(0,0,0,0.125)',
              shadowRadius: 6,
              shadowOffset: { height: 3, width: -1 },
            })}
          >
            <AbsoluteYStack fullscreen alignItems="center" justifyContent="center">
              <Paragraph fontSize={fontSize} fontWeight="300" letterSpacing={-1}>
                {numberFormat(score, 'sm')}
              </Paragraph>
            </AbsoluteYStack>
            <ProgressRing
              size={Math.round(sizePx)}
              color={colors.color400}
              percent={rating * 10}
              width={sizePx * 0.05}
            />
          </YStack>
        )}
        {voteContent}
      </XStack>
    )
  }
)
