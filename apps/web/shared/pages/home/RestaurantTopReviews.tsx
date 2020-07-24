import { graphql, query } from '@dish/graph'
import {
  HStack,
  LoadingItem,
  LoadingItems,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
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
              {state.showMore ? 'Show less' : 'Comments'}
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
                  restuarantId={restaurantId}
                  onPress={() =>
                    setState((state) => ({
                      ...state,
                      showAddComment: !state.showAddComment,
                    }))
                  }
                />
              </HStack>

              {state.showAddComment && (
                <>
                  <Spacer />
                  <RestaurantAddComment restaurantId={restaurantId} />
                </>
              )}

              <Suspense fallback={null}>
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
