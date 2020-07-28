import { graphql } from '@dish/graph'
import { Spacer, StackProps, Tooltip, VStack } from '@dish/ui'
import React, { memo, useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { bgLight } from '../../colors'
import { HomeActiveTagIds } from '../../state/home'
import { useMediaQueryIsSmall } from './useMediaQueryIs'
import { useUserUpvoteDownvote } from './useUserReview'

export const RestaurantUpVoteDownVote = memo(
  graphql(
    ({
      restaurantId,
      activeTagIds,
    }: {
      restaurantId: string
      activeTagIds: HomeActiveTagIds
    }) => {
      const [vote, setVote] = useUserUpvoteDownvote(restaurantId, activeTagIds)
      const isOpenProp =
        vote === 0
          ? null
          : {
              isOpen: false,
            }
      return (
        <VStack
          className="hover-to-reveal-child"
          pointerEvents="auto"
          width={22}
        >
          <Tooltip position="right" contents="Underrated" {...isOpenProp}>
            <VoteButton
              Icon={ChevronUp}
              voted={vote == 1}
              color={vote === 1 ? 'green' : null}
              onPressOut={() => {
                setVote(vote === 1 ? 0 : 1)
              }}
            />
          </Tooltip>
          <Spacer size={32} />
          <Tooltip position="right" contents="Overrated" {...isOpenProp}>
            <VoteButton
              Icon={ChevronDown}
              voted={vote == -1}
              color={vote === -1 ? 'red' : null}
              onPressOut={() => {
                setVote(vote == -1 ? 0 : -1)
              }}
            />
          </Tooltip>
        </VStack>
      )
    }
  )
)

const VoteButton = ({
  color,
  Icon,
  ...props
}: StackProps & { voted?: boolean; Icon: any; color?: string }) => {
  const isSmall = useMediaQueryIsSmall()
  const scale = isSmall ? 1.1 : 1
  const [hovered, setHovered] = useState(false)
  return (
    <VStack
      width={24 * scale}
      height={24 * scale}
      borderRadius={100}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      backgroundColor="#fff"
      borderColor="white"
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...(props.voted && {
        backgroundColor: '#999',
      })}
      {...props}
    >
      <Icon
        size={28}
        color={color ?? (hovered ? '#000' : '#ccc')}
        style={{ ...styleMedia }}
      />
    </VStack>
  )
}
