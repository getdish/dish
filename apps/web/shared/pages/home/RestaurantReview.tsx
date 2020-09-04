import { graphql, query } from '@dish/graph'
import { Text } from '@dish/ui'
import React, { memo } from 'react'

import { lightGreen, lightGrey, lightRed, lightYellow } from '../../colors'
import { CommentBubble } from './CommentBubble'

export const RestaurantReview = memo(
  graphql(({ reviewId }: { reviewId: string }) => {
    const review = query.review({
      limit: 1,
      where: {
        id: {
          _eq: reviewId,
        },
      },
    })[0]

    const sentiments = review.sentiments()

    return (
      <CommentBubble
        expandable
        ellipseContentAbove={400}
        text={review.text ?? ''}
        after={
          <Text lineHeight={26} fontSize={14} color="rgba(0,0,0,0.7)">
            {!!review.rating && (
              <Text
                borderRadius={100}
                backgroundColor={
                  review.rating >= 4
                    ? lightGreen
                    : review.rating >= 3
                    ? lightYellow
                    : lightRed
                }
                width={20}
                height={20}
                // @ts-ignore
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                margin={-2}
                fontSize={12}
                fontWeight="400"
              >
                {review.rating}
              </Text>
            )}
            &nbsp; &nbsp;
            {!!review.authored_at && (
              <Text>
                {new Intl.DateTimeFormat().format(new Date(review.authored_at))}{' '}
                &nbsp; &nbsp;
              </Text>
            )}
            {!!sentiments?.length
              ? sentiments.map((x, i) => {
                  return (
                    <React.Fragment key={i}>
                      <Text
                        backgroundColor={
                          x.sentiment > 0
                            ? lightGreen
                            : x.sentiment < 0
                            ? lightRed
                            : lightGrey
                        }
                        paddingHorizontal={4}
                        paddingVertical={1}
                        margin={-2}
                        borderRadius={6}
                      >
                        {x.tag.name}{' '}
                        {(x.sentiment > 0 || x.sentiment < 0) && (
                          <Text fontSize={11}>
                            {x.sentiment > 0 ? '+' : '-'}
                            {x.sentiment}
                          </Text>
                        )}
                      </Text>
                      <Text>&nbsp; &nbsp;</Text>
                    </React.Fragment>
                  )
                })
              : []}
          </Text>
        }
        user={{
          username: (review.username ?? '').replace(/^[a-z0-9]\-/gi, ''),
        }}
      />
    )
  })
)
