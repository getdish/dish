import { query } from '@dish/graph'
import { graphql } from '@gqless/react'
import React, { memo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import Hoverable from '../ui/Hoverable'
import { Icon } from '../ui/Icon'
import { VStack } from '../ui/Stacks'
import { useReviewMutation } from './useReviewMutation'

export const RestaurantUpVoteDownVote = graphql(
  ({ restaurantId }: { restaurantId: string }) => {
    const [review] = query.review({
      limit: 1,
      where: {
        restaurant_id: {
          _eq: restaurantId,
        },
      },
    })
    // const [insertReview, { data, fetchState, errors }] = useReviewMutation()
    const vote = review?.rating
    console.log('rating (upvotedownvote)', vote)
    return (
      <div
        style={{
          filter: vote !== 0 ? '' : 'grayscale(100%)',
        }}
      >
        <VStack pointerEvents="auto" width={22}>
          <VoteButton
            style={styles.topButton}
            active={vote == 1}
            onPress={() => {
              // insertReview({
              //   restaurant_id: restaurantId,
              //   rating: vote === 1 ? 0 : 1,
              // })
            }}
          >
            <Icon
              name="ChevronUp"
              size={12}
              color={vote === 1 ? 'green' : 'black'}
              marginBottom={-12}
            />
          </VoteButton>
          <VoteButton
            style={styles.bottomButton}
            active={vote == -1}
            onPress={() => {
              // insertReview({
              //   restaurant_id: restaurantId,
              //   rating: vote == -1 ? 0 : -1,
              // })
            }}
          >
            <Icon
              name="ChevronDown"
              size={12}
              color={vote === -1 ? 'red' : 'black'}
            />
          </VoteButton>
        </VStack>
      </div>
    )
  }
)

const VoteButton = (props: any) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Hoverable
        onHoverIn={() => setIsHovered(true)}
        onHoverOut={() => setIsHovered(false)}
      >
        <View
          style={[
            styles.button,
            isHovered && styles.hovered,
            props.active && styles.active,
            props.style,
          ]}
        >
          {props.children}
        </View>
      </Hoverable>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    height: 24,
    width: 16,
    // paddingLeft: 4,
    // marginLeft: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.09)',
    shadowRadius: 10,
    shadowOffset: { height: 1, width: 0 },
  },
  hovered: {
    backgroundColor: '#eee',
  },
  active: {
    backgroundColor: '#eee',
  },
  topButton: {
    // borderTopLeftRadius: 8,
    borderTopRightRadius: 10,
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  bottomButton: {
    paddingTop: 4,
    borderTopWidth: 0,
    // borderBottomLeftRadius: 8,
    borderBottomRightRadius: 10,
  },
})
