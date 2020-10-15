import { ChevronDown, ChevronUp } from '@dish/react-feather'
import { StackProps, Text, Tooltip, VStack, prevent } from '@dish/ui'
import React, { memo, useState } from 'react'

import { bgLight } from '../colors'
import { useIsNarrow } from '../hooks/useIs'

export const UpvoteDownvoteScore = memo(
  ({
    score,
    vote,
    subtle,
    setVote,
    size,
    ...props
  }: {
    size?: 'sm' | 'md'
    score: number
    vote: -1 | 0 | 1
    setVote?: (vote: number) => void
    subtle?: boolean
  } & StackProps) => {
    score = Math.round(score)
    const voteButtonColor = subtle ? '#f2f2f2' : null
    const scale = size === 'sm' ? 0.75 : 1
    const sizePx = 58 * scale
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

    return (
      <VStack
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        width={sizePx}
        height={sizePx}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={10}
        shadowOffset={{ height: 3, width: -3 }}
        borderRadius={1000}
        {...props}
      >
        {subtle ? (
          upvote
        ) : (
          <Tooltip position="right" contents="Upvote" {...isOpenProp}>
            {upvote}
          </Tooltip>
        )}
        <Text
          fontSize={Math.min(16, sizePx / `${score}`.length) * scale}
          fontWeight="600"
          marginVertical={-2 * scale}
          letterSpacing={-0.5}
          color={score > 0 ? '#000' : 'darkred'}
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
