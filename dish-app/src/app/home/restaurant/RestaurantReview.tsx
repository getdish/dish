import { graphql, query, useRefetch } from '@dish/graph'
import { uniqBy } from 'lodash'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'
import { Divider, HStack, Text, TextProps, useLazyEffect } from 'snackui'

import { lightGreen, lightRed, lightYellow } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { CommentBubble } from '../../views/CommentBubble'
import { Link } from '../../views/Link'
import { SentimentText } from './SentimentText'

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
      hideRestaurantName,
      height,
    }: {
      reviewId: string
      refetchKey?: string
      hideUsername?: boolean
      hideRestaurantName?: boolean
      height?: number
    }) => {
      const refetch = useRefetch()
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
        // refetchAll()
        refetch(reviews).catch(console.error)
      }, [refetchKey])

      if (!review) {
        return null
      }

      const sentiments = review.sentiments()

      const authoredAt = review.authored_at ? (
        <Text {...bottomMetaTextProps} marginLeft={6}>
          {new Intl.DateTimeFormat().format(new Date(review.authored_at))} &nbsp; &nbsp;
        </Text>
      ) : null

      const meta = (
        <>
          {!!review.rating && (
            <Text
              {...bottomMetaTextProps}
              borderRadius={100}
              backgroundColor={
                review.rating >= 4 ? lightGreen : review.rating >= 3 ? lightYellow : lightRed
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
          {authoredAt}
        </>
      )

      let name = hideUsername ? '' : review.username ?? ''
      const isYelp = name?.startsWith('yelp-')
      name = isYelp ? 'Yelp' : name

      return (
        <CommentBubble
          expandable
          {...(!hideRestaurantName && {
            title: (
              <Text fontWeight="800">
                <Link name="restaurant" params={{ slug: review.restaurant.slug ?? '' }}>
                  {review.restaurant.name ?? ''}
                </Link>
              </Text>
            ),
          })}
          date={review.updated_at}
          belowContent={review.vote ? <SentimentText sentiment={review.vote} /> : null}
          bubbleHeight={height}
          avatar={review.user.avatar ?? ''}
          height={height}
          ellipseContentAbove={200}
          text={review.text ?? ''}
          name={name}
          after={
            !!review.text ? (
              <HStack width="100%" overflow="hidden" alignItems="center" maxWidth="100%">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {!!sentiments?.length
                    ? uniqBy(sentiments, (x) => x.tag.name).map((x, i) => {
                        const snt = x.ml_sentiment
                        return (
                          <React.Fragment key={i}>
                            <SentimentText sentiment={snt}>{x.tag.name}</SentimentText>
                            <Text>&nbsp;</Text>
                          </React.Fragment>
                        )
                      })
                    : []}
                </ScrollView>

                <Divider flex />
              </HStack>
            ) : null
          }
        />
      )
    }
  )
)
