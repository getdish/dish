import { graphql, mutation } from '@dish/graph'
import { HStack, Toast, VStack } from '@dish/ui'
import { isUndefined } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { MessageSquare } from 'react-feather'
import { TextInput } from 'react-native'

import { bgLight } from '../../colors'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton, SmallButtonProps } from '../../views/ui/SmallButton'
import { flatButtonStyleSelected } from './baseButtonStyle'
import { CommentBubble } from './CommentBubble'
import { RestaurantReview } from './RestaurantReview'
import { useUserReview } from './useUserReview'

export const RestaurantAddCommentButton = graphql(
  ({
    restaurantId,
    ...props
  }: SmallButtonProps & { restaurantId?: string }) => {
    const review = useUserReview(restaurantId)
    return (
      <SmallButton
        pressStyle={{
          opacity: 0.6,
        }}
        {...props}
      >
        {review?.text ? 'Edit review' : 'Add review'}
        <MessageSquare
          size={16}
          opacity={0.5}
          style={{
            margin: -4,
            marginLeft: 5,
          }}
        />
      </SmallButton>
    )
  }
)

export const RestaurantAddComment = memo(
  graphql(({ restaurantId }: { restaurantId: string }) => {
    const om = useOvermind()
    const user = om.state.user.user
    const review = useUserReview(restaurantId)
    const [reviewText, setReviewText] = useState('')
    const [isSaved, setIsSaved] = useState(true)
    const lineHeight = 22
    const [height, setHeight] = useState(lineHeight)

    useEffect(() => {
      if (!isUndefined(review?.text)) {
        setReviewText(review?.text)
      }
    }, [review?.text])

    if (!user) {
      console.warn('no user')
      return null
    }

    return (
      <VStack>
        {!!review && (
          <RestaurantReview
            userName={review.user.username}
            reviewText={review.text}
          />
        )}
        <CommentBubble backgroundColor={bgLight} user={user}>
          <HStack position="relative" width="100%">
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
                setReviewText(text)
              }}
              multiline
              placeholder="Be sure to..."
              style={{
                minHeight: height,
                lineHeight: 22,
                flex: 1,
                padding: 10,
              }}
            />
            {!isSaved && (
              <LinkButton
                {...flatButtonStyleSelected}
                position="absolute"
                right={0}
                onPress={async () => {
                  Toast.show('Saving...')
                  console.log('inserting', review)

                  if (review) {
                    review.text = reviewText
                  } else {
                    mutation.insert_review({
                      objects: [
                        {
                          restaurant_id: restaurantId,
                          rating: 0,
                          user_id: user.id,
                          text: reviewText,
                        },
                      ],
                    })
                  }
                  // insertReview({
                  //   review: {
                  //     text: reviewText,
                  //     restaurant_id: restaurantId,
                  //     tag_id: null,
                  //     user_id: om.state.user.user.id,
                  //     rating: 0,
                  //   },
                  // })
                  Toast.show('Saved!')
                  setIsSaved(true)
                }}
              >
                Save
              </LinkButton>
            )}
          </HStack>
        </CommentBubble>
      </VStack>
    )
  })
)
