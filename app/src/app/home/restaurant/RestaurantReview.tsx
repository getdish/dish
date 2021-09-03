import { getUserName, graphql, review } from '@dish/graph'
import React, { memo } from 'react'
import { Divider, HStack, Text, VStack } from 'snackui'

import { CommentBubble, CommentBubbleProps } from '../../views/CommentBubble'
import { Link } from '../../views/Link'
import { RestaurantReviewEdit } from './RestaurantReviewEdit'
import { ReviewTagsRow } from './ReviewTagsRow'
import { SentimentText } from './SentimentText'

export type RestaurantReviewProps = Partial<CommentBubbleProps> & {
  listTheme?: 'modern' | 'minimal'
  restaurantSlug?: string
  listSlug?: string
  review?: review | null
  isEditing?: boolean
  refetchKey?: string
  hideUsername?: boolean
  hideRestaurantName?: boolean
  height?: number
  onEdit?: (text: string) => void
  onDelete?: () => void
  showEmptyReview?: boolean
}

export const RestaurantReview = memo(
  graphql(
    (props: RestaurantReviewProps) => {
      const {
        name: propName,
        refetchKey,
        hideUsername,
        hideRestaurantName,
        height,
        // @ts-ignore,
        isEditing,
        onEdit,
        onDelete,
        after,
        restaurantSlug,
        listSlug,
        listTheme,
        review,
        showEmptyReview,
        ...commentBubbleProps
      } = props

      if (isEditing) {
        return <RestaurantReviewEdit {...props} onEdit={onEdit} onDelete={onDelete} />
      }

      if (!review && !showEmptyReview) {
        return <ReviewTagsRow {...props} />
      }

      const name = getUserName(review?.user)
      let userName = propName ?? (hideUsername ? '' : name ?? '')
      const isYelp = userName?.startsWith('yelp-')
      userName = isYelp ? 'Yelp' : userName

      return (
        <>
          {/* {showAddTag && <RateRestaurantTagsModal onDismiss={() => setShowAddTag(false)} />} */}
          <VStack width="100%">
            <CommentBubble
              chromeless={listTheme === 'minimal'}
              expandable
              {...(!hideRestaurantName && {
                title: (
                  <Text fontWeight="800">
                    <Link name="restaurant" params={{ slug: review?.restaurant?.slug || '' }}>
                      {review?.restaurant?.name ?? ''}
                    </Link>
                  </Text>
                ),
              })}
              date={review?.updated_at}
              // belowContent={<>{review?.vote ? <SentimentText sentiment={review?.vote} /> : null}</>}
              bubbleHeight={height}
              avatar={{
                image: review?.user.avatar ?? '',
                charIndex: review?.user.charIndex || 0,
              }}
              height={height}
              ellipseContentAbove={200}
              text={review?.text ?? ''}
              name={userName}
              after={
                <HStack flex={1} overflow="hidden" alignItems="center" maxWidth="100%">
                  <VStack flex={1} />
                  {after}
                </HStack>
              }
              {...commentBubbleProps}
            />

            <ReviewTagsRow
              {...props}
              restaurantSlug={props.restaurantSlug ?? review?.restaurant?.slug}
            />
          </VStack>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
