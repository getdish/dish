import { graphql, refetch, user } from '@dish/graph'
import { Trash } from '@dish/react-feather'
import { uniqBy } from 'lodash'
import React, { memo, useEffect, useState } from 'react'
import {
  Divider,
  HStack,
  Input,
  LoadingItem,
  Paragraph,
  Spacer,
  Text,
  VStack,
  useLazyEffect,
  useMedia,
} from 'snackui'

import { red } from '../../../constants/colors'
import { tagLenses } from '../../../constants/localTags'
import { getWindowWidth } from '../../../helpers/getWindow'
import { AuthForm } from '../../AuthForm'
import { suspense } from '../../hoc/suspense'
import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { CommentBubble, CommentBubbleProps } from '../../views/CommentBubble'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { SentimentText } from './SentimentText'

type RestaurantReviewProps = Partial<CommentBubbleProps> & {
  restaurantSlug: string
  user: user
  // review?: review
  // reviewId?: string
  isEditing?: boolean
  refetchKey?: string
  hideUsername?: boolean
  hideRestaurantName?: boolean
  height?: number
}

// // most flexible way we can pass in reviews
// type RestaurantReviewsProps = {
//   restaurantSlug: string
//   username: string
// }
// export const useRestaurantReviews = () => {
// }

export const RestaurantReview = suspense(
  memo((props: RestaurantReviewProps) => {
    if ('isEditing' in props && props.isEditing) {
      return <RestaurantReviewContentEdit {...props} />
    }
    return <RestaurantReviewContent {...props} />
  }),
  <LoadingItem />
)

const RestaurantReviewContent = memo(
  graphql((props: RestaurantReviewProps) => {
    const {
      name: propName,
      refetchKey,
      hideUsername,
      hideRestaurantName,
      user,
      height,
      restaurantSlug,
      // @ts-ignore,
      isEditing,
      after,
      ...commentBubbleProps
    } = props

    const media = useMedia()
    const reviews = user.reviews({
      where: {
        restaurant: {
          slug: {
            _eq: restaurantSlug,
          },
        },
      },
    })

    const review = reviews.find((x) => !!x.text?.length)

    const sentiments = review?.sentiments()
    let userName = propName ?? (hideUsername ? '' : review?.username ?? '')
    const isYelp = userName?.startsWith('yelp-')
    userName = isYelp ? 'Yelp' : userName

    const tags = review?.restaurant?.top_tags({
      args: {
        // _tag_types: 'dish',
      },
      limit: 10,
    })

    console.log('tags', tags)

    useLazyEffect(() => {
      if (refetchKey) {
        console.log('refetching review', refetchKey)
        refetch(review)
      }
    }, [refetchKey])

    return (
      <VStack>
        <CommentBubble
          expandable
          {...(!hideRestaurantName && {
            title: (
              <Text fontWeight="800">
                <Link name="restaurant" params={{ slug: restaurantSlug }}>
                  {review?.restaurant?.name ?? ''}
                </Link>
              </Text>
            ),
          })}
          date={review?.updated_at}
          belowContent={
            <>
              {review?.vote ? <SentimentText sentiment={review?.vote} /> : null}
              {/* {meta} */}
            </>
          }
          bubbleHeight={height}
          avatar={{
            image: review?.user.avatar ?? '',
            charIndex: review?.user.charIndex || 0,
          }}
          height={height}
          ellipseContentAbove={200}
          text={review?.text ?? ''}
          name={userName}
          maxWidth={media.sm ? getWindowWidth() - 130 : 650}
          after={
            <HStack flex={1} overflow="hidden" alignItems="center" maxWidth="100%">
              {!!sentiments?.length &&
                uniqBy(sentiments, (x) => x.tag.name).map((x, i) => {
                  const snt = x.ml_sentiment
                  return (
                    <React.Fragment key={i}>
                      <SentimentText sentiment={snt}>{x.tag.name}</SentimentText>
                      <Text>&nbsp;</Text>
                    </React.Fragment>
                  )
                })}
              <Divider flex />
              {after}
            </HStack>
          }
          {...commentBubbleProps}
        />

        <HStack width="100%" alignItems="center" spacing>
          <Paragraph ellipse minWidth={40} opacity={0.5}>
            Tags:
          </Paragraph>
          <HStack spacing="sm">
            {[...(tags ? tags.map((x) => x.tag) : []), ...tagLenses].map((tag) => (
              <TagButton
                restaurantSlug={restaurantSlug}
                key={tag.id || 0}
                {...getTagButtonProps(tag)}
                votable
              />
            ))}
          </HStack>
        </HStack>
      </VStack>
    )
  })
)

const RestaurantReviewContentEdit = graphql((props: RestaurantReviewProps) => {
  const { user, review, upsertReview, deleteReview, reviewsQuery } = useUserReviewCommentQuery(
    props.restaurantSlug,
    {
      onUpsert: () => {
        refetch(reviewsQuery).catch(console.error)
      },
      onDelete: () => {
        refetch(reviewsQuery).catch(console.error)
      },
    }
  )
  const [reviewText, setReviewText] = useState('')
  const [isSaved, setIsSaved] = useState(false)
  // const [restaurant] = queryRestaurant(props.restaurantSlug)
  // const [height, setHeight] = useState(lineHeight)

  useEffect(() => {
    if (review?.text) {
      setReviewText(review.text)
    }
  }, [review?.text])

  console.log('rendering me', props, user, 'review is', reviewsQuery, review)

  if (!user) {
    console.warn('no user')
    return <AuthForm />
  }

  return (
    <RestaurantReviewContent
      {...props}
      user={user}
      avatar={{
        charIndex: user.charIndex || 0,
        image: user.avatar || '',
      }}
      name={user.name || user.username || ''}
      date={new Date()}
      text={
        <Input
          value={reviewText}
          // onChange={(e) => {
          //   // @ts-ignore
          //   const height = e.nativeEvent.srcElement.scrollHeight
          //   setHeight(height)
          // }}
          onChangeText={(text) => {
            if (isSaved) {
              setIsSaved(false)
            }
            setReviewText(text)
          }}
          multiline
          numberOfLines={5}
          placeholder="...a note, a tip, a whole review, it's up to you."
          marginHorizontal={-10}
          marginVertical={-5}
        />
      }
      after={
        <>
          <SmallButton
            theme="red"
            accessible
            accessibilityRole="button"
            icon={<Trash color={red} size={12} />}
            onPress={() => {
              if (confirm('Are you sure you want to delete the review?')) {
                deleteReview()
              }
            }}
          />
          <Spacer size="sm" />
          <SmallButton
            theme="active"
            accessible
            accessibilityRole="button"
            disabled={isSaved}
            alignSelf="center"
            textProps={{
              fontWeight: '700',
            }}
            marginVertical={10}
            onPress={() => {
              upsertReview({
                text: reviewText,
              })
              setIsSaved(true)
            }}
          >
            Save
          </SmallButton>
        </>
      }
      isEditing
    />
  )
})

// const meta = (
//   <>
//     {!!review.rating && (
//       <Text
//         {...bottomMetaTextProps}
//         borderRadius={100}
//         backgroundColor={
//           review.rating >= 4 ? green200 : review.rating >= 3 ? yellow200 : red200
//         }
//         lineHeight={20}
//         paddingHorizontal={12}
//         // @ts-ignore
//         display={isWeb ? 'inline-flex' : 'flex'}
//         alignItems="center"
//         justifyContent="center"
//         margin={-2}
//         fontSize={12}
//         fontWeight="400"
//       >
//         {review.rating === 1 ? 'Upvote' : 'Downvote'}
//       </Text>
//     )}
//     {authoredAt}
//   </>
// )

// const bottomMetaTextProps: TextProps = {
//   lineHeight: 26,
//   fontSize: 14,
//   color: 'rgba(0,0,0,0.7)',
// }
