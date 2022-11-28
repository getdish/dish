import { isWeb } from '../../constants/constants'
import { isTouchDevice } from '../../constants/platforms'
import { numberFormat } from '../../helpers/numberFormat'
import { ProgressRing } from '../home/ProgressRing'
import { useUserStore } from '../userStore'
import { VoteButton } from './VoteButton'
import { supportsTouchWeb } from '@dish/helpers'
import {
  AbsoluteYStack,
  Card,
  Paragraph,
  TooltipSimple,
  XStack,
  YGroup,
  YStack,
  YStackProps,
  useTheme,
} from '@dish/ui'
import { ArrowDown, ArrowUp } from '@tamagui/lucide-icons'
import React, { memo } from 'react'

export type ScoreProps = YStackProps & {
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
          <YGroup>
            {subtle ? (
              getUpvote({})
            ) : (
              <TooltipSimple placement="right" label={upTooltip ?? 'Upvote'} {...isOpenProp}>
                {getUpvote({})}
              </TooltipSimple>
            )}
            {subtle ? (
              getDownvote({})
            ) : (
              <TooltipSimple
                placement="right"
                label={downTooltip ?? 'Downvote'}
                {...isOpenProp}
              >
                {getDownvote({})}
              </TooltipSimple>
            )}
          </YGroup>
        </>
      )
    }

    const theme = useTheme()

    const colors =
      typeof rating === 'number'
        ? rating >= 7
          ? 'green'
          : rating < 5
          ? 'red'
          : 'grey'
        : 'grey'

    return (
      <XStack
        position="relative"
        pointerEvents="auto"
        alignItems="center"
        space="$2"
        justifyContent="center"
        className={isWeb && !supportsTouchWeb && showVoteOnHover ? ' show-on-hover' : ''}
        {...props}
      >
        {typeof rating === 'number' && (
          <Card
            borderRadius={1000}
            height={sizePx}
            position="relative"
            {...(shadowed && {
              elevation: '$2',
            })}
          >
            <AbsoluteYStack fullscreen alignItems="center" justifyContent="center">
              <Paragraph fontSize={fontSize} fontWeight="300" letterSpacing={-1}>
                {numberFormat(score, 'sm')}
              </Paragraph>
            </AbsoluteYStack>
            <ProgressRing
              size={Math.round(sizePx)}
              color={`$${colors}`}
              percent={rating * 10}
              width={sizePx * 0.05}
            />
          </Card>
        )}
        {voteContent}
      </XStack>
    )
  }
)
