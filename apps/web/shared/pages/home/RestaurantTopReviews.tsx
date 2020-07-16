import { graphql, query } from '@dish/graph'
import { HStack, LoadingItems, Spacer, Text, VStack } from '@dish/ui'
import React, { Suspense, memo, useState } from 'react'

import { SmallButton } from '../../views/ui/SmallButton'
import {
  RestaurantAddComment,
  RestaurantAddCommentButton,
} from './RestaurantAddComment'
import { RestaurantReview } from './RestaurantReview'

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
              {state.showMore ? 'Show less' : 'Tips'}
            </Text>
          </SmallButton>
          {afterTopCommentButton ? (
            <>
              <Spacer size="sm" />
              {afterTopCommentButton}
            </>
          ) : null}
        </>
      )
      return (
        <VStack alignSelf="stretch" paddingRight={20}>
          {!expandTopComments && <HStack>{expandCommentButton}</HStack>}

          {!!(state.showMore || expandTopComments) && (
            <VStack paddingTop={20} spacing={10}>
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

              <Suspense fallback={<LoadingItems />}>
                <Content
                  numToShow={
                    state.showMore ? Infinity : expandTopComments ?? Infinity
                  }
                  restaurantId={restaurantId}
                />
              </Suspense>
              {expandTopComments < totalToShow ? expandCommentButton : null}
            </VStack>
          )}
        </VStack>
      )
    }
  )
)

export const RestaurantOverview = memo(() => {
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
      category: 'Tips',
      review: 'Quick, cheap, local favorite',
    },
  ]

  return (
    <VStack marginTop={4} marginBottom={12}>
      {listItems.map((item, index) => (
        <React.Fragment key={item.category}>
          <Text>
            <HStack
              // @ts-ignore
              display="inline-flex"
              width="10%"
              marginRight={2}
              alignItems="center"
              justifyContent="flex-end"
            >
              <Text
                // paddingVertical={2}
                paddingHorizontal={5}
                borderRadius={6}
                fontWeight="600"
                opacity={0.65}
              >
                {item.category}:
              </Text>
            </HStack>
            {item.review}
          </Text>
          {index < listItems.length - 1 && <Spacer size={8} />}
        </React.Fragment>
      ))}
    </VStack>
  )
})

const Content = memo(
  graphql(
    ({
      restaurantId,
      numToShow,
    }: {
      restaurantId: string
      numToShow: number
    }) => {
      let topReviews = query.review({
        limit: 3,
        where: {
          restaurant_id: {
            _eq: restaurantId,
          },
        },
      })

      return (
        <>
          {topReviews.map((review, i) => (
            <RestaurantReview
              key={i}
              userName={review.user.username}
              reviewText={review.text}
            />
          ))}
          {!topReviews.length && (
            <VStack minHeight={100} alignItems="center" justifyContent="center">
              <Text opacity={0.5} fontSize={12}>
                No reviews, yet!
              </Text>
            </VStack>
          )}
        </>
      )
    }
  )
)
