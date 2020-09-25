import { ChevronDown, ChevronUp } from '@dish/react-feather'
import { StackProps, Text, Tooltip, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'

import { bgLight } from '../colors'
import { useIsNarrow } from '../hooks/useIs'

export const UpvoteDownvoteScore = memo(
  ({
    score,
    vote,
    setVote,
    ...props
  }: {
    score: number
    vote: -1 | 0 | 1
    setVote: (vote: number) => void
  } & StackProps) => {
    const isOpenProp =
      vote === 0
        ? null
        : {
            isOpen: false,
          }
    return (
      <VStack
        pointerEvents="auto"
        alignItems="center"
        justifyContent="center"
        width={56}
        height={56}
        backgroundColor="#fff"
        shadowColor="rgba(0,0,0,0.1)"
        shadowRadius={10}
        shadowOffset={{ height: 3, width: -3 }}
        borderRadius={1000}
        {...props}
      >
        <Tooltip position="right" contents="Upvote" {...isOpenProp}>
          <VoteButton
            Icon={ChevronUp}
            voted={vote == 1}
            color={vote === 1 ? 'green' : null}
            onPress={(e) => {
              e.stopPropagation()
              setVote(vote === 1 ? 0 : 1)
            }}
          />
        </Tooltip>
        <Text
          fontSize={Math.min(16, 120 / `${score}`.length / 2)}
          fontWeight="700"
          marginVertical={-2}
          letterSpacing={-0.5}
          color={score > 0 ? '#000' : 'darkred'}
        >
          {score}
        </Text>
        <Tooltip position="right" contents="Downvote" {...isOpenProp}>
          <VoteButton
            Icon={ChevronDown}
            voted={vote == -1}
            color={vote === -1 ? 'red' : null}
            onPress={(e) => {
              e.stopPropagation()
              setVote(vote == -1 ? 0 : -1)
            }}
          />
        </Tooltip>
      </VStack>
    )
  }
)

export const VoteButton = ({
  color,
  Icon,
  size,
  voted,
  ...props
}: StackProps & {
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
      // borderWidth={1}
      // backgroundColor="#fff"
      // borderColor="#eee"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...props}
    >
      <Icon
        size={(size ?? 18) * (voted ? 1.2 : 1)}
        color={color ?? (hovered ? '#000' : '#ccc')}
      />
    </VStack>
  )
}
