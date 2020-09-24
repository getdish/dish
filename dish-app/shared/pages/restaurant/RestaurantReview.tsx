import { graphql, query, refetch } from '@dish/graph'
import {
  Divider,
  HStack,
  Spacer,
  Text,
  TextProps,
  useLazyEffect,
} from '@dish/ui'
import { uniqBy } from 'lodash'
import React, { memo } from 'react'

import { lightGreen, lightGrey, lightRed, lightYellow } from '../../colors'
import { isWeb } from '../../constants'
import { CommentBubble } from '../../views/CommentBubble'

const bottomMetaTextProps: TextProps = {
  lineHeight: 26,
  fontSize: 14,
  color: 'rgba(0,0,0,0.7)',
}

export const RestaurantReview = memo(
  graphql(
    ({
      reviewId,
      refetchKey,
      hideUsername,
      showRestaurant,
    }: {
      reviewId: string
      refetchKey?: string
      hideUsername?: boolean
      showRestaurant?: boolean
    }) => {
      const reviews = query.review({
        limit: 1,
        where: {
          id: {
            _eq: reviewId,
          },
        },
      })
      const review = reviews[0]

      useLazyEffect(() => {
        refetch(reviews)
      }, [refetchKey])

      const sentiments = review.sentiments()

      const meta = (
        <>
          {!!review.rating && (
            <Text
              {...bottomMetaTextProps}
              borderRadius={100}
              backgroundColor={
                review.rating >= 4
                  ? lightGreen
                  : review.rating >= 3
                  ? lightYellow
                  : lightRed
              }
              lineHeight={20}
              paddingHorizontal={12}
              // @ts-ignore
              display={isWeb ? 'inline-flex' : 'flex'}
              alignItems="center"
              justifyContent="center"
              margin={-2}
              fontSize={12}
              fontWeight="400"
            >
              {review.rating === 1 ? 'Upvote' : 'Downvote'}
            </Text>
          )}
          &nbsp; &nbsp;
          {!!review.authored_at && (
            <Text {...bottomMetaTextProps}>
              {new Intl.DateTimeFormat().format(new Date(review.authored_at))}{' '}
              &nbsp; &nbsp;
            </Text>
          )}
        </>
      )

      return (
        <CommentBubble
          expandable
          ellipseContentAbove={400}
          text={review.text ?? ''}
          name={hideUsername ? null : review.username ?? ''}
          afterName={
            showRestaurant ? (
              <HStack alignItems="center">
                <Text fontSize={14}>&nbsp; on {review.restaurant.name}</Text>
                <Spacer />
                {meta}
              </HStack>
            ) : null
          }
          after={
            !!review.text ? (
              <HStack
                width="100%"
                alignItems="center"
                flexWrap="wrap"
                maxWidth="100%"
              >
                {!!sentiments?.length
                  ? uniqBy(sentiments, (x) => x.tag.name).map((x, i) => {
                      const snt = x.ml_sentiment
                      return (
                        <React.Fragment key={i}>
                          <Text
                            {...bottomMetaTextProps}
                            backgroundColor={
                              snt > 0
                                ? lightGreen
                                : snt < 0
                                ? lightRed
                                : lightGrey
                            }
                            paddingHorizontal={4}
                            margin={-2}
                            borderRadius={6}
                            ellipse
                          >
                            {x.tag.name}{' '}
                            {(snt > 0 || snt < 0) && (
                              <Text fontSize={11}>
                                {snt > 0 ? '+' : ''}
                                {Math.round(snt)}
                              </Text>
                            )}
                          </Text>
                          <Text>&nbsp; &nbsp;</Text>
                        </React.Fragment>
                      )
                    })
                  : []}

                <Divider flex />
              </HStack>
            ) : null
          }
        />
      )
    }
  )
)
