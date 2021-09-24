import { getUserName, graphql, list, review } from '@dish/graph'
import React, { memo } from 'react'
import { HStack, Spacer, Text, VStack } from 'snackui'

import { CommentBubble, CommentBubbleProps } from '../../views/CommentBubble'
import { Link } from '../../views/Link'
import { RestaurantReviewEdit } from './RestaurantReviewEdit'
import { ReviewImagesRow } from './ReviewImagesRow'
import { ReviewTagsRow } from './ReviewTagsRow'

export type RestaurantReviewProps = Partial<CommentBubbleProps> & {
  size?: 'lg' | 'md'
  listTheme?: 'modern' | 'minimal'
  restaurantSlug?: string
  listSlug?: string
  review?: review | null
  list?: list | null
  isEditing?: boolean
  refetchKey?: string
  hideUsername?: boolean
  hideRestaurantName?: boolean
  height?: number
  onEdit?: (text: string) => void
  onDelete?: () => void
  showEmptyReview?: boolean
  hideImagesRow?: boolean
  hideTagsRow?: boolean
  wrapTagsRow?: boolean
  votable?: boolean
  hideGeneralTags?: boolean
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
        isEditing,
        onEdit,
        onDelete,
        votable,
        after,
        hideGeneralTags,
        listSlug,
        listTheme,
        wrapTagsRow,
        hideTagsRow,
        hideImagesRow,
        review,
        showEmptyReview,
        ...commentBubbleProps
      } = props

      if (isEditing) {
        return <RestaurantReviewEdit {...props} />
      }

      // todo can we weave this with query?
      const restaurantSlug = props.restaurantSlug ?? (review?.restaurant?.slug || '')

      const tagsRowEl = (
        <>
          {!hideTagsRow && (
            <ReviewTagsRow
              {...props}
              wrapTagsRow={wrapTagsRow}
              restaurantSlug={restaurantSlug}
              votable={votable}
              hideGeneralTags={hideGeneralTags}
            />
          )}
        </>
      )

      const name = getUserName(review?.user)
      const userName = hideUsername ? '' : propName ?? name ?? ''

      return (
        <>
          {/* {showAddTag && <RateRestaurantTagsModal onDismiss={() => setShowAddTag(false)} />} */}
          <VStack width="100%">
            {!!(review || showEmptyReview) && (
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
                // @ts-ignore
                source={review?.source}
                height={height}
                ellipseContentAbove={200}
                text={review?.text ?? ''}
                name={userName}
                username={userName}
                after={
                  <HStack flex={1} overflow="hidden" alignItems="center" maxWidth="100%">
                    <VStack flex={1} />
                    {after}
                  </HStack>
                }
                {...commentBubbleProps}
              />
            )}

            {tagsRowEl}

            {!hideImagesRow && (
              <>
                <Spacer />
                <ReviewImagesRow
                  restaurantSlug={restaurantSlug}
                  review={review}
                  isEditing={isEditing || showEmptyReview}
                />
              </>
            )}
          </VStack>
        </>
      )
    },
    {
      suspense: false,
    }
  )
)
