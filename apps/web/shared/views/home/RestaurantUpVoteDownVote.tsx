import { Restaurant, Review } from '@dish/models'
import React, { memo, useRef, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { useOvermind } from '../../state/om'
import { Toast } from '../Toast'
import Hoverable from '../ui/Hoverable'
import { Icon } from '../ui/Icon'
import { VStack } from '../ui/Stacks'

export const RestaurantUpVoteDownVote = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const [rating, setRating] = useState(0)
    const om = useOvermind()
    const review = useRef<Review>(new Review())
    const updateRating = async (r: number) => {
      setRating(r)
      review.current.rating = r
      review.current.restaurant_id = restaurant.id
      await om.actions.home.submitReview(review.current)
      Toast.show('Saved')
    }

    return (
      <div
        style={{
          filter: rating !== 0 ? '' : 'grayscale(100%)',
        }}
      >
        <VStack pointerEvents="auto" width={22}>
          <VoteButton
            style={styles.topButton}
            active={rating == 1}
            onPress={() => {
              if (rating == 1) return updateRating(0)
              updateRating(1)
            }}
          >
            <Icon
              name="ChevronUp"
              size={15}
              color={rating === 1 ? 'green' : 'black'}
              marginBottom={-12}
            />
          </VoteButton>
          <VoteButton
            style={styles.bottomButton}
            active={rating == -1}
            onPress={() => {
              if (rating == -1) return updateRating(0)
              updateRating(-1)
            }}
          >
            <Icon
              name="ChevronDown"
              size={15}
              color={rating === -1 ? 'red' : 'black'}
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
    height: 35,
    width: 22,
    paddingLeft: 4,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: 'rgba(0,0,0,0.09)',
    shadowRadius: 3,
    shadowOffset: { height: 1, width: 0 },
  },
  hovered: {
    backgroundColor: '#eee',
  },
  active: {
    backgroundColor: '#eee',
  },
  topButton: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  bottomButton: {
    paddingTop: 4,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
})
