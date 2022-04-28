import { SentimentText } from '../home/restaurant/SentimentText'
import { CommentBubble } from './CommentBubble'
import { Link } from './Link'
import { getUserName, graphql, review, useRefetch } from '@dish/graph'
import { Paragraph, Separator, Text, XStack, useLazyEffect } from '@dish/ui'
import { allLightColors } from '@tamagui/theme-base'
import { uniqBy } from 'lodash'
import React, { memo } from 'react'
import { ScrollView } from 'react-native'

const getQueryFullReview = (review?: review) => {
  if (!review) return null
  review.favorited
  return {
    text: review.text,
    id: review.id,
    user_id: review.user_id,
    username: review.username,
    list_id: review.list_id,
    restaurant_id: review.restaurant_id,
    favorited: review.favorited,
    vote: review.vote,
    authored_at: review.authored_at,
    updated_at: review.updated_at,
    rating: review.rating,
    source: review.source,
    user: {
      name: review.user?.name ?? '',
      username: review.user?.username ?? '',
      avatar: review.user?.avatar ?? '',
      charIndex: review.user?.charIndex ?? 0,
    },
    restaurant: review.restaurant
      ? {
          name: review.restaurant.name,
          slug: review.restaurant.slug,
        }
      : null,
    list: review.list
      ? {
          name: review.list.name,
          slug: review.list.slug,
        }
      : null,
    sentiments: review.sentiments()?.map((x) => ({
      name: x.tag.name,
      sentiment: x.ml_sentiment,
    })),
  }
}

export const Review = memo(
  graphql((props: { review?: review; refetchKey?: string; hideUsername?: boolean }) => {
    const review = getQueryFullReview(props.review)
    const refetch = useRefetch()

    useLazyEffect(() => {
      if (props.refetchKey) {
        refetch(review)
      }
    }, [props.refetchKey])

    if (!review) {
      return null
    }

    const meta = !!review.rating && (
      <Text
        borderRadius={100}
        backgroundColor={
          review.rating >= 4
            ? allLightColors.green8
            : review.rating >= 3
            ? allLightColors.yellow8
            : allLightColors.red8
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
    )

    let name = props.hideUsername ? '' : getUserName(review.user) ?? ''
    const isYelp = name?.startsWith('yelp-')
    name = isYelp ? 'Yelp' : name

    return (
      <CommentBubble
        expandable
        title={
          <Text fontWeight="800">
            <Link name="restaurant" params={{ slug: review.restaurant?.slug ?? '' }}>
              {review.restaurant?.name ?? ''}
            </Link>
          </Text>
        }
        date={review.updated_at}
        // belowContent={review.vote ? <SentimentText sentiment={review.vote} /> : null}
        afterName={meta}
        avatar={{
          image: review.user?.avatar ?? '',
          charIndex: review.user?.charIndex || 0,
        }}
        ellipseContentAbove={200}
        text={review.text}
        name={name}
        username={review.user?.username}
        after={
          !!review.text ? (
            <XStack w="100%" ov="hidden" ai="center" maxWidth="100%">
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {!!review.sentiments?.length
                  ? uniqBy(review.sentiments, (x) => x.name).map((x, i) => {
                      return (
                        <React.Fragment key={i}>
                          <SentimentText sentiment={x.sentiment}>{x.name}</SentimentText>
                          <Text>&nbsp;</Text>
                        </React.Fragment>
                      )
                    })
                  : []}
              </ScrollView>

              <Separator />
            </XStack>
          ) : null
        }
      >
        {!review.text && (
          <>
            {!!review.favorited && (
              <Paragraph>
                {getUserName(review.user)} favorited {review.list?.name ?? review.restaurant?.name}
              </Paragraph>
            )}
          </>
        )}
      </CommentBubble>
    )
  })
)
