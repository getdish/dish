import { graphql, query } from '@dish/graph'
import { HStack, Spacer, Text, VStack } from '@dish/ui'
import { memo } from 'react'

import { lightGreen, lightGrey, lightRed, lightYellow } from '../../colors'
import { CommentBubble } from './CommentBubble'
import { RatingView } from './RatingView'
import { TextStrong } from './TextStrong'

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
    // userName={review.user.username}
    //               reviewText={review.text}
    //               source={review.source}
    //               rating={review.rating}

    const sentiments = review.sentiments()

    return (
      <CommentBubble
        expandable
        ellipseContentAbove={400}
        text={review.text ?? ''}
        after={
          <Text fontSize={14} color="rgba(0,0,0,0.7)">
            <HStack alignItems="center" spacing>
              {!!review.rating && (
                <VStack
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
                  alignItems="center"
                  justifyContent="center"
                  margin={-2}
                >
                  <TextStrong fontSize={12}>{review.rating}</TextStrong>
                </VStack>
              )}
              {!!sentiments?.length
                ? sentiments.map((x, i) => {
                    return (
                      <Text
                        key={i}
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
                    )
                  })
                : []}

              {/* {!!review.authored_at && (
                <Text>
                  {new Intl.DateTimeFormat().format(review.authored_at)}
                </Text>
              )} */}
            </HStack>
          </Text>
        }
        user={{
          username: (review.username ?? '').replace(/^[a-z0-9]\-/gi, ''),
        }}
      />
    )
  })
)
