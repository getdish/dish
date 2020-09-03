import {
  graphql,
  mutation,
  restaurantDishesWithPhotos,
  restaurantPhotosForCarousel,
} from '@dish/graph'
import {
  AbsoluteVStack,
  Divider,
  HStack,
  LoadingItems,
  SmallTitle,
  Spacer,
  Toast,
  VStack,
} from '@dish/ui'
import { isUndefined } from 'lodash'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Image, ScrollView, TextInput } from 'react-native'

import { bgLight } from '../../colors'
import { pageWidthMax, zIndexGallery } from '../../constants'
import { HomeStateItemReview } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton, smallButtonBaseStyle } from '../../views/ui/SmallButton'
import { flatButtonStyleSelected } from './baseButtonStyle'
import { CommentBubble } from './CommentBubble'
import { RestaurantLenseVote } from './RestaurantLenseVote'
import { RestaurantReview } from './RestaurantReview'
import { StackViewCloseButton } from './StackViewCloseButton'
import { Title } from './Title'
import { useRestaurantQuery } from './useRestaurantQuery'
import { useUserReview } from './useUserReview'

export default memo(function HomePageRestaurantReview() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'restaurantReview') {
    return (
      <AbsoluteVStack
        fullscreen
        backgroundColor="rgba(0,0,0,0.5)"
        alignItems="center"
        justifyContent="center"
        zIndex={zIndexGallery}
      >
        <VStack
          width="80%"
          height="80%"
          backgroundColor="#fff"
          borderRadius={15}
          maxWidth={pageWidthMax * 0.9}
          alignItems="center"
          position="relative"
          overflow="hidden"
          shadowColor="rgba(0,0,0,0.5)"
          shadowRadius={40}
        >
          <VStack width="100%" height="100%" flex={1}>
            <AbsoluteVStack top={5} right={26}>
              <StackViewCloseButton />
            </AbsoluteVStack>
            <Suspense fallback={<LoadingItems />}>
              <HomePageReviewContent state={state} />
            </Suspense>
          </VStack>
        </VStack>
      </AbsoluteVStack>
    )
  }

  return null
})

const HomePageReviewContent = memo(
  graphql(function HomePageReviewContent({
    state,
  }: {
    state: HomeStateItemReview
  }) {
    const restaurant = useRestaurantQuery(state.restaurantSlug)

    return (
      <VStack flex={1} overflow="hidden">
        <ScrollView style={{ width: '100%' }}>
          <VStack padding={18} spacing="lg">
            <SmallTitle>Review {restaurant.name}</SmallTitle>

            <Suspense fallback={<LoadingItems />}>
              <RestaurantReviewComment
                restaurantSlug={state.restaurantSlug}
                restaurantId={restaurant.id}
              />
            </Suspense>
          </VStack>
        </ScrollView>
      </VStack>
    )
  })
)

export const RestaurantReviewComment = memo(
  graphql(
    ({
      restaurantId,
      restaurantSlug,
    }: {
      restaurantId: string
      restaurantSlug: string
    }) => {
      const om = useOvermind()
      const user = om.state.user.user
      const review = useUserReview(restaurantId)
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [reviewText, setReviewText] = useState('')
      const [isSaved, setIsSaved] = useState(false)
      const lineHeight = 22
      const [height, setHeight] = useState(lineHeight)
      const dishTags = restaurantDishesWithPhotos(restaurant)

      useEffect(() => {
        if (!isUndefined(review?.text)) {
          setReviewText(review?.text ?? '')
        }
      }, [review?.text])

      if (!user) {
        console.warn('no user')
        return null
      }

      return (
        <VStack>
          <CommentBubble backgroundColor={bgLight} user={user as any}>
            <TextInput
              value={reviewText}
              onChange={(e) => {
                // @ts-ignore
                const height = e.nativeEvent.srcElement.scrollHeight
                setHeight(height)
              }}
              onChangeText={(text) => {
                if (isSaved) {
                  setIsSaved(false)
                }
                setReviewText(text)
              }}
              multiline
              placeholder="Be sure to..."
              style={{
                minHeight: height,
                lineHeight: 22,
                flex: 1,
                padding: 10,
              }}
            />
          </CommentBubble>

          {!isSaved && (
            <LinkButton
              {...smallButtonBaseStyle}
              alignSelf="flex-end"
              marginTop={-15}
              onPress={async () => {
                Toast.show('Saving...')
                console.log('inserting', review)

                if (review) {
                  review.text = reviewText
                } else {
                  mutation.insert_review({
                    objects: [
                      {
                        restaurant_id: restaurantId,
                        rating: 0,
                        user_id: user.id,
                        text: reviewText,
                      },
                    ],
                  })
                }
                Toast.show('Saved!')
                setIsSaved(true)
              }}
            >
              Save
            </LinkButton>
          )}

          {!!review && (
            <>
              <Spacer size="xl" />
              <SmallTitle divider="center">Current Review</SmallTitle>
              <RestaurantReview
                userName={review.user?.username ?? ''}
                reviewText={review.text ?? ''}
              />
            </>
          )}

          <Spacer size="xl" />

          <SmallTitle divider="center">Votes</SmallTitle>

          <HStack>
            <VStack spacing paddingVertical={20} flex={1}>
              <SmallTitle divider="off">Lenses</SmallTitle>
              <RestaurantLenseVote
                restaurantId={restaurantId}
                flexDirection="column"
              />
            </VStack>

            <VStack spacing paddingVertical={20} flex={1}>
              <SmallTitle divider="off">Dishes</SmallTitle>
              {dishTags.map((tag) => {
                return (
                  <SmallButton key={tag.name}>
                    <Image
                      style={{ width: 22, height: 22, borderRadius: 100 }}
                      source={{ uri: tag.image }}
                    />
                    <Spacer />
                    {tag.name}
                  </SmallButton>
                )
              })}
            </VStack>
          </HStack>
        </VStack>
      )
    }
  )
)
