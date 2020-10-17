import { graphql } from '@dish/graph'
import { ChevronDown, ChevronUp } from '@dish/react-feather'
import React from 'react'
import { StackProps, Tooltip, VStack, prevent } from 'snackui'

import { useUserUpvoteDownvoteQuery } from '../hooks/useUserUpvoteDownvoteQuery'
import { FavoriteButtonProps } from './FavoriteButton'

export const TagVoteButton = graphql(
  ({
    size,
    restaurantId,
    tagId,
  }: {
    size?: FavoriteButtonProps['size']
    restaurantId: string
    tagId: string
  }) => {
    const { vote, setVote } = useUserUpvoteDownvoteQuery(restaurantId, {
      [tagId]: true,
    })
    // console.log('vote', vote, tagId)
    const borderRadius = 5
    return (
      <VStack
        pointerEvents="auto"
        borderRadius={borderRadius}
        shadowColor="rgba(0,0,0,0.5)"
        shadowRadius={10}
      >
        <VotePillButton
          tooltip="Underrated"
          borderTopLeftRadius={borderRadius}
          borderTopRightRadius={borderRadius}
          onPress={(e) => {
            prevent(e)
            setVote(1)
          }}
          Icon={ChevronUp}
        />
        <VotePillButton
          tooltip="Overrated"
          borderBottomLeftRadius={borderRadius}
          borderBottomRightRadius={borderRadius}
          onPress={(e) => {
            prevent(e)
            setVote(-1)
          }}
          Icon={ChevronDown}
        />
      </VStack>
    )
  }
)

const VotePillButton = ({
  Icon,
  tooltip,
  ...props
}: StackProps & { Icon: any; tooltip: string }) => {
  return (
    // <Tooltip position="right" contents={tooltip}>
    <VStack
      width={20}
      height={20}
      alignItems="center"
      justifyContent="center"
      borderWidth={1}
      backgroundColor="#fff"
      borderColor="white"
      hoverStyle={{
        backgroundColor: '#eee',
      }}
      pressStyle={{
        transform: [{ scale: 0.95 }],
      }}
      {...props}
    >
      <Icon size={28} color="#666" />
    </VStack>
    // </Tooltip>
  )
}
