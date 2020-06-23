import { graphql, query } from '@dish/graph'
import { HStack, SmallTitle, Spacer, Text, VStack } from '@dish/ui'
import { memo, useState } from 'react'
import React from 'react'
import { MessageSquare } from 'react-feather'

import {
  CommentBubble,
  RestaurantAddComment,
  RestaurantAddCommentButton,
} from './RestaurantAddComment'
import { SmallButton } from './SmallButton'

const listItems = [
  {
    category: 'Food',
    review: `Authentic. Don't miss: lychee tempura ice cream`,
  },
  {
    category: 'Vibe',
    review: 'Laid back, good service',
  },
  {
    category: 'Rest',
    review: 'Quick, cheap, local favorite',
  },
]

export const RestaurantTopReviews = memo(
  graphql(
    ({
      restaurantId,
      expandTopComments,
      afterTopCommentButton,
    }: {
      restaurantId: string
      expandTopComments?: number
      afterTopCommentButton?: any
    }) => {
      const [state, setState] = useState({
        showAddComment: false,
        showMore: false,
      })
      const totalToShow = 3
      const expandCommentButton = (
        <>
          <SmallButton
            onPress={() => {
              setState((x) => ({ ...x, showMore: !x.showMore }))
            }}
          >
            <Text fontSize={13} opacity={0.7}>
              {state.showMore ? 'Show less' : 'Comments'}
            </Text>
          </SmallButton>
          {afterTopCommentButton ? (
            <>
              <Spacer />
              {afterTopCommentButton}
            </>
          ) : null}
        </>
      )
      return (
        <VStack alignSelf="stretch" paddingRight={20}>
          <VStack marginTop={4} marginBottom={12} spacing={10}>
            {listItems.map((item) => (
              <React.Fragment key={item.category}>
                <Text fontSize={14}>
                  <HStack
                    display="inline-flex"
                    width={45}
                    marginRight={5}
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <Text
                      backgroundColor="#f2f2f2"
                      paddingVertical={2}
                      paddingHorizontal={5}
                      borderRadius={6}
                      fontWeight="500"
                    >
                      {item.category}
                    </Text>
                  </HStack>
                  <Text>{item.review}</Text>
                </Text>
              </React.Fragment>
            ))}
          </VStack>

          <Spacer />

          {!expandTopComments && <HStack>{expandCommentButton}</HStack>}

          {!!(state.showMore || expandTopComments) && (
            <VStack paddingTop={20} spacing={10}>
              <SmallTitle divider="center">Top comments</SmallTitle>

              <HStack>
                <Spacer flex={1} />
                <RestaurantAddCommentButton
                  onPress={() =>
                    setState((state) => ({
                      ...state,
                      showAddComment: !state.showAddComment,
                    }))
                  }
                  restuarantId={restaurantId}
                />
              </HStack>

              {state.showAddComment && (
                <>
                  <Spacer />
                  <RestaurantAddComment restaurantId={restaurantId} />
                </>
              )}

              <RestaurantTopReviewsContent
                numToShow={
                  state.showMore ? Infinity : expandTopComments ?? Infinity
                }
                restaurantId={restaurantId}
              />
              {expandTopComments < totalToShow ? expandCommentButton : null}
            </VStack>
          )}
        </VStack>
      )
    }
  )
)

const RestaurantTopReviewsContent = memo(
  graphql(
    ({
      restaurantId,
      numToShow,
    }: {
      restaurantId: string
      numToShow: number
    }) => {
      const topReviews = query.review({
        limit: 3,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      })

      const all = [...topReviews, 0, 1, 2].slice(0, numToShow)

      return (
        <>
          {all.map((_, i) => (
            <CommentBubble key={i} user={{ username: 'PeachBot' }}>
              <Text selectable opacity={0.8} lineHeight={20} fontSize={14}>
                {`Lorem ipsu dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit ipsum sit amet. Lorem ipsum dolor sit amet sit amet. Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet.`}
              </Text>
            </CommentBubble>
          ))}
        </>
      )
    }
  )
)
