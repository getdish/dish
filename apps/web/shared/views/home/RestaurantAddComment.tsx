import { Restaurant } from '@dish/models'
import React, { memo, useLayoutEffect, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity } from 'react-native'

import { useOvermind } from '../../state/om'
import { Toast } from '../Toast'
import { Box } from '../ui/Box'
import { Circle } from '../ui/Circle'
import { HoverablePopover } from '../ui/HoverablePopover'
import { Link, LinkButton } from '../ui/Link'
import { HStack, VStack } from '../ui/Stacks'
import { flatButtonStyle } from './baseButtonStyle'
import { Quote } from './HomePageRestaurant'

const avatar = require('../../assets/peach.png')

export const RestaurantAddComment = memo(
  ({ restaurant }: { restaurant: Restaurant }) => {
    const om = useOvermind()
    const user = om.state.user.user
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
        <VStack marginBottom={-20} spacing="xs">
          <HStack alignItems="center" spacing="sm">
            <Circle size={22} marginVertical={-5}>
              <Image source={avatar} style={{ width: 22, height: 22 }} />
            </Circle>
            <Text style={{ color: '#999' }}>
              <Link
                inline
                name="user"
                params={{ username: user.username }}
                color="blue"
              >
                {user.username}
              </Link>
              &nbsp;&nbsp;
              <HoverablePopover
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
                <div className="see-through inline-flex">
                  {['👨‍🍳'].map((x) => (
                    <Text key={x} style={{ opacity: 1 }}>
                      {x}
                    </Text>
                  ))}
                </div>
              </HoverablePopover>{' '}
              says...
            </Text>
          </HStack>

          <HStack
            {...flatButtonStyle}
            borderRadius={10}
            flex={0}
            marginLeft={20}
            maxWidth="70%"
          >
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
                        tag_id: null,
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
        </VStack>
      </TouchableOpacity>
    )
  }
)
