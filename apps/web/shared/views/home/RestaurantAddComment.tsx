import { Restaurant } from '@dish/models'
import React, { useState, useLayoutEffect, memo } from 'react'
import { TouchableOpacity, TextInput } from 'react-native'

import { useOvermind } from '../../state/om'
import { Link, LinkButton } from '../shared/Link'
import { HStack, VStack } from '../shared/Stacks'
import { Quote } from './HomeRestaurantView'
import { flatButtonStyle } from './baseButtonStyle'
import { Toast } from '../Toast'

export const RestaurantAddComment = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const om = useOvermind()
    const review = om.state.user.allReviews[restaurant.id]
    const [isFocused, setIsFocused] = useState(false)
    const [reviewText, setReviewText] = useState('')
    const [isSaved, setIsSaved] = useState(true)
    const lineHeight = 22
    const [height, setHeight] = useState(lineHeight)

    const updateReview = (text: string) => {
      setReviewText(text)
    }

    useLayoutEffect(() => {
      if (review?.text) {
        updateReview(review.text)
      }
    }, [review])

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => {}}>
        <VStack marginTop={20} marginBottom={-20}>
          <Quote>
            <HStack width="100%">
              <TextInput
                value={reviewText}
                onChange={(e) => {
                  // @ts-ignore
                  const height = e.nativeEvent.srcElement.scrollHeight
                  setHeight(height)
                }}
                onChangeText={(text) => {
                  if (isSaved) {
                    setIsSaved(false)
                  }
                  updateReview(text)
                }}
                multiline
                placeholder="Write your comment..."
                style={{
                  width: '100%',
                  minHeight: height,
                  lineHeight: 22,
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              {!!(isFocused || !isSaved) && (
                <LinkButton
                  {...flatButtonStyle}
                  marginVertical={-4}
                  onPress={async () => {
                    Toast.show('Saving...')
                    await om.effects.gql.mutations.upsertUserReview({
                      reviews: [
                        {
                          text: reviewText,
                          restaurant_id: restaurant.id,
                          taxonomy_id: null,
                          user_id: om.state.user.user.id,
                          rating: 0,
                        },
                      ],
                    })
                    Toast.show('Saved!')
                    setIsSaved(true)
                  }}
                >
                  Save
                </LinkButton>
              )}
            </HStack>
          </Quote>
        </VStack>
      </TouchableOpacity>
    )
  }
)
