import { Restaurant, User } from '@dish/models'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity } from 'react-native'

import { useMutation } from '../../../src/graphql'
// @ts-ignore
import avatar from '../../assets/peach.png'
import { useOvermind } from '../../state/om'
import { Toast } from '../Toast'
import { Box } from '../ui/Box'
import { Circle } from '../ui/Circle'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link, LinkButton } from '../ui/Link'
import { HStack, StackProps, VStack } from '../ui/Stacks'
import { flatButtonStyleSelected } from './baseButtonStyle'
import { bgLight } from './colors'

export const RestaurantAddComment = memo(
  ({ restaurantId }: { restaurantId: string }) => {
    const om = useOvermind()
    const user = om.state.user.user
    const review = om.state.user.allReviews[restaurantId]
    const [isFocused, setIsFocused] = useState(false)
    const [reviewText, setReviewText] = useState('')
    const [isSaved, setIsSaved] = useState(true)
    const lineHeight = 22
    const [height, setHeight] = useState(lineHeight)

    const [insertReview, { data, fetchState, errors }] = useMutation(
      (schema, variables) => {
        debugger
        schema.data.insert_review({
          objects: [
            {
              reviews: [variables.review],
            },
          ],
        })
      }
    )
    console.log('addcomment', data, fetchState, errors)

    const updateReview = (text: string) => {
      setReviewText(text)
    }

    useLayoutEffect(() => {
      if (review?.text) {
        updateReview(review.text)
      }
    }, [review])

    return (
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
              updateReview(text)
            }}
            multiline
            placeholder="Be sure to..."
            style={{
              minHeight: height,
              lineHeight: 22,
              flex: 1,
              padding: 10,
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          {!!(isFocused || !isSaved) && (
            <LinkButton
              {...flatButtonStyleSelected}
              position="absolute"
              right={0}
              onPress={async () => {
                Toast.show('Saving...')
                console.log('inserting', review)
                insertReview({
                  review: {
                    text: reviewText,
                    restaurant_id: restaurantId,
                    tag_id: null,
                    user_id: om.state.user.user.id,
                    rating: 0,
                  },
                })
                Toast.show('Saved!')
                setIsSaved(true)
              }}
            >
              Save
            </LinkButton>
          )}
        </HStack>
      </CommentBubble>
    )
  }
)

export const CommentBubble = ({
  user,
  children,
  ...rest
}: StackProps & {
  user: Partial<User>
  children: any
}) => {
  return (
    <VStack
      flex={1}
      hoverStyle={null}
      borderRadius={10}
      padding={4}
      alignItems="flex-start"
      justifyContent="flex-start"
      spacing={1}
      {...rest}
    >
      <HStack alignItems="center" spacing={6} flexWrap="nowrap">
        <Circle size={18} marginBottom={-2}>
          <Image source={avatar} style={{ width: 18, height: 18 }} />
        </Circle>
        <Text style={{ color: '#999' }}>
          <Link
            inline
            name="user"
            params={{ username: user.username }}
            fontWeight="600"
          >
            {user.username}
          </Link>
          &nbsp;
          <HoverablePopover
            inline
            contents={
              <Box>
                <Text style={{ opacity: 0.65 }}>
                  <ul>
                    <li>👨‍🍳 Chef ✔️</li>
                    <li>🇯🇵 Japanese Exprt ✔️</li>
                  </ul>
                </Text>
              </Box>
            }
          >
            <div className="inline-flex">
              {['👨‍🍳'].map((x) => (
                <Text key={x} style={{ opacity: 1 }}>
                  {x}
                </Text>
              ))}
            </div>
          </HoverablePopover>{' '}
          says
        </Text>
      </HStack>
      {children}
    </VStack>
  )
}
