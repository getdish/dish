import { graphql } from '@dish/graph'
import { Spacer, StackProps, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { bgLight } from '../../colors'
import { HomeActiveTagIds } from '../../state/home'
import { useUserUpvoteDownvote } from './useUserReview'

const voteButtonStyle: StackProps = {
  borderRadius: 100,
  width: 20,
  height: 20,
  alignItems: 'center',
  justifyContent: 'center',
}

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
      const iconSize = 14
      return (
        <div
          style={{
            filter: vote !== 0 ? '' : 'grayscale(100%)',
          }}
        >
          <VStack pointerEvents="auto" width={22}>
            <VoteButton
              {...voteButtonStyle}
              voted={vote == 1}
              onPressOut={() => {
                setVote(vote === 1 ? 0 : 1)
              }}
            >
              <ChevronUp
                size={iconSize}
                color={vote === 1 ? 'green' : '#ccc'}
              />
            </VoteButton>
            <Spacer size={32} />
            <VoteButton
              {...voteButtonStyle}
              voted={vote == -1}
              onPressOut={() => {
                setVote(vote == -1 ? 0 : -1)
              }}
            >
              <ChevronDown
                size={iconSize}
                style={{ color: vote === -1 ? 'red' : '#ccc' }}
              />
            </VoteButton>
          </VStack>
        </div>
      )
    }
  )
)

const VoteButton = (props: StackProps & { voted?: boolean }) => {
  return (
    <VStack
      height={24}
      width={20}
      borderWidth={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="#fff"
      borderColor="white"
      hoverStyle={{
        backgroundColor: '#eee',
        borderColor: '#ddd',
      }}
      pressStyle={{
        backgroundColor: bgLight,
        borderColor: '#aaa',
      }}
      {...(props.voted && {
        backgroundColor: '#999',
      })}
      {...props}
    />
  )
}
