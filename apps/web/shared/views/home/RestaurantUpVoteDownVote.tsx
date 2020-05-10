import { query } from '@dish/graph'
import { Restaurant } from '@dish/models'
import { graphql } from '@gqless/react'
import React, { memo, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import Hoverable from '../ui/Hoverable'
import { Icon } from '../ui/Icon'
import { VStack } from '../ui/Stacks'
import { useReviewMutation } from './useReviewMutation'

export const RestaurantUpVoteDownVote = memo(
  graphql(({ restaurant }: { restaurant: Restaurant }) => {
    const [review] = query.review({
      where: {
        restaurant_id: {
          _eq: restaurant.id,
        },
      } as any,
    })

    const [insertReview, { data, fetchState, errors }] = useReviewMutation()

    console.log('review', review, { data, fetchState, errors })
    const vote = review.rating
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
              insertReview({
                restaurant_id: restaurant.id,
                rating: vote === 1 ? 0 : 1,
              })
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
              insertReview({
                restaurant_id: restaurant.id,
                rating: vote == -1 ? 0 : -1,
              })
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
  })
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
