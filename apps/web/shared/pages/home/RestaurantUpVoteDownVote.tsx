import { graphql, mutation, reviewUpsert } from '@dish/graph'
import { Spacer, StackProps, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { bgLight } from '../../colors'
import { HomeActiveTagIds } from '../../state/home'
import { useOvermind } from '../../state/useOvermind'
import { useUserReviews, useUserUpvoteDownvote } from './useUserReview'

export const RestaurantUpVoteDownVote = memo(
  graphql(
    ({
      restaurantId,
      activeTagIds,
    }: {
      restaurantId: string
      activeTagIds: HomeActiveTagIds
    }) => {
      const om = useOvermind()
      const userId = om.state.user.user?.id
      const [vote, setVote] = useUserUpvoteDownvote(restaurantId, activeTagIds)
      console.log('vote', vote)
      const iconSize = 14
      const voteButtonStyle: StackProps = {
        borderRadius: 100,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 10,
      }
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
                const rating = vote === 1 ? 0 : 1
                setVote(rating)
                // reviewUpsert([
                //   {
                //     restaurant_id: restaurantId,
                //     rating,
                //     user_id: userId,
                //   },
                // ])
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
                const rating = vote == -1 ? 0 : -1
                setVote(rating)
                // reviewUpsert([
                //   {
                //     restaurant_id: restaurantId,
                //     rating,
                //     user_id: userId,
                //   },
                // ])
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
      // shadowColor="rgba(0,0,0,0.035)"
      // shadowRadius={2}
      // shadowOffset={{ height: 2, width: -2 }}
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
