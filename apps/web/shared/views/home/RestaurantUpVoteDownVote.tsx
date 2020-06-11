import { graphql, mutation } from '@dish/graph'
import { StackProps, VStack } from '@dish/ui'
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
    const voteButtonStyle = {
      paddingTop: 4,
      borderTopWidth: 0,
      borderBottomRightRadius: 10,
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
            <ChevronUp
              size={12}
              color={vote === 1 ? 'green' : 'black'}
              style={{
                marginBottom: -12,
              }}
            />
          </VoteButton>
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
              size={12}
              style={{ color: vote === -1 ? 'red' : 'black' }}
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
      borderColor="#ddd"
      alignItems="center"
      justifyContent="center"
      backgroundColor="#fff"
      shadowColor="rgba(0,0,0,0.09)"
      shadowRadius={10}
      shadowOffset={{ height: 1, width: 0 }}
      hoverStyle={{
        backgroundColor: '#eee',
      }}
      pressStyle={{
        backgroundColor: bgLight,
      }}
      {...(props.voted && {
        backgroundColor: '#999',
      })}
      {...props}
    />
  )
}
