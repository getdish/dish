import { AuthForm } from '../../AuthForm'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useCurrentUserQuery } from '../../hooks/useUserReview'
import { CommentBubble, CommentBubbleProps } from '../../views/CommentBubble'
import { Link } from '../../views/Link'
import { SmallButton } from '../../views/SmallButton'
import { ReviewImagesRow } from './ReviewImagesRow'
import { ReviewTagsRow } from './ReviewTagsRow'
import { getUserName, graphql, list, review } from '@dish/graph'
import { Input, Spacer, Text, XStack, YStack } from '@dish/ui'
import { Trash } from '@tamagui/feather-icons'
import { default as React, memo, useEffect, useState } from 'react'

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
          <YStack maxWidth={720} alignSelf="center" width="100%">
            {!!(review || showEmptyReview) && (
              <CommentBubble
                // chromeless={listTheme === 'minimal'}
                expandable={!showEmptyReview}
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
                username={review?.user.username || ''}
                after={
                  <XStack flex={1} overflow="hidden" alignItems="center" maxWidth="100%">
                    <YStack flex={1} />
                    {after}
                  </XStack>
                }
                {...commentBubbleProps}
              />
            )}

            {tagsRowEl}

            {/* TEMP TODO REMOVE hideRestaurantName SLOW RPAGE */}
            {!hideImagesRow && !hideRestaurantName && (
              <>
                <Spacer />
                <ReviewImagesRow
                  restaurantSlug={restaurantSlug}
                  review={review}
                  isEditing={isEditing || showEmptyReview}
                />
              </>
            )}
          </YStack>
        </>
      )
    },
    {
      suspense: true,
    }
  )
)

export const RestaurantReviewEdit = graphql((props: RestaurantReviewProps) => {
  const { review, onEdit, onDelete } = props
  const [user] = useCurrentUserQuery()
  const [reviewText, setReviewText] = useStateSynced('')
  const [isSaved, setIsSaved] = useState(false)
  // const [height, setHeight] = useState(lineHeight)

  useEffect(() => {
    if (review?.text) {
      setReviewText(review.text)
    }
  }, [review?.text])

  if (!user) {
    console.warn('no user')
    return <AuthForm />
  }

  return (
    <RestaurantReview
      {...props}
      showEmptyReview
      // prevent infinite recursion
      isEditing={false}
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
          numberOfLines={6}
          lineHeight={22}
          placeholder="Write..."
          autoFocus
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
            icon={<Trash color="red" size={16} />}
            onPress={() => {
              if (confirm('Are you sure you want to delete the review?')) {
                onDelete?.()
              }
            }}
          />
          <Spacer size="$2" />
          <SmallButton
            theme="active"
            accessible
            accessibilityRole="button"
            disabled={isSaved}
            alignSelf="center"
            marginVertical={10}
            onPress={() => {
              setIsSaved(true)
              onEdit?.(reviewText)
            }}
          >
            Save
          </SmallButton>
        </>
      }
    />
  )
})
