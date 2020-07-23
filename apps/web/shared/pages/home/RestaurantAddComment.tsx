import { User as UserModel, graphql, mutation } from '@dish/graph'
import {
  Circle,
  HStack,
  SmallButtonProps,
  StackProps,
  Text,
  Toast,
  VStack,
} from '@dish/ui'
import { isUndefined } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import { MessageSquare, User } from 'react-feather'
import { TextInput } from 'react-native'

import { bgLight } from '../../colors'
import { useOvermind } from '../../state/useOvermind'
import { Link } from '../../views/ui/Link'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { flatButtonStyleSelected } from './baseButtonStyle'
import { RestaurantReview } from './RestaurantReview'
import { useUserReview, useUserReviews } from './useUserReview'

export const RestaurantAddCommentButton = ({
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
      <MessageSquare
        size={16}
        color="#000"
        style={{
          margin: -4,
          marginRight: 5,
        }}
      />
      {review?.text ? 'Edit review' : 'Add review'}
    </SmallButton>
  )
}

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

export const CommentBubble = ({
  user,
  children,
  ...rest
}: StackProps & {
  user: Partial<UserModel>
  children: any
}) => {
  return (
    <VStack
      flex={1}
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      {...rest}
    >
      <HStack
        alignItems="center"
        spacing={6}
        flexWrap="nowrap"
        marginBottom={10}
      >
        <Circle size={18} marginBottom={-2}>
          <User color="#000" size={12} />
        </Circle>
        <Text selectable color="#999" fontSize={13}>
          <Link
            name="user"
            params={{ username: user.username }}
            fontWeight="600"
            color="#666"
          >
            {user.username}
          </Link>
          &nbsp; says
        </Text>
      </HStack>
      {children}
    </VStack>
  )
}
