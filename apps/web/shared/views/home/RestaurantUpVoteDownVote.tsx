import { graphql, mutation } from '@dish/graph'
import { Spacer, StackProps, VStack } from '@dish/ui'
import React, { memo } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { useOvermind } from '../../state/useOvermind'
import { bgLight } from './colors'
import { useUserReview } from './useUserReview'

export const RestaurantUpVoteDownVote = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
    const om = useOvermind()
    const userId = om.state.user.user?.id
    const review = useUserReview(restaurantId)
    const vote = review?.rating
    const iconSize = 14
    const voteButtonStyle: StackProps = {
      borderRadius: 100,
      width: 22,
      height: 22,
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
              // @ts-ignore
              mutation.insert_review({
                objects: [
                  {
                    restaurant_id: restaurantId,
                    rating: vote === 1 ? 0 : 1,
                    user_id: userId,
                  },
                ],
              })
            }}
          >
            <ChevronUp size={iconSize} color={vote === 1 ? 'green' : '#555'} />
          </VoteButton>
          <Spacer size={38} />
          <VoteButton
            {...voteButtonStyle}
            voted={vote == -1}
            onPressOut={() => {
              // @ts-ignore
              mutation.insert_review({
                objects: [
                  {
                    restaurant_id: restaurantId,
                    rating: vote == -1 ? 0 : -1,
                    user_id: userId,
                  },
                ],
              })
            }}
          >
            <ChevronDown
              size={iconSize}
              style={{ color: vote === -1 ? 'red' : '#555' }}
            />
          </VoteButton>
        </VStack>
      </div>
    )
  })
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
      shadowColor="rgba(0,0,0,0.035)"
      shadowRadius={2}
      shadowOffset={{ height: 2, width: -2 }}
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
