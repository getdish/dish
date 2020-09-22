import { graphql, restaurantDishesWithPhotos } from '@dish/graph'
import { fetchBertSentiment } from '@dish/helpers'
import {
  AbsoluteVStack,
  HStack,
  LoadingItem,
  LoadingItems,
  SmallTitle,
  Spacer,
  VStack,
  useDebounceEffect,
} from '@dish/ui'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Image, ScrollView, TextInput } from 'react-native'

import { pageWidthMax, zIndexGallery } from '../../constants'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { HomeStateItemReview } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { tagLenses } from '../../state/tagLenses'
import { flatButtonStyle } from '../../views/baseButtonStyle'
import { CommentBubble } from '../../views/CommentBubble'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { TagSmallButton } from '../../views/TagSmallButton'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { RestaurantLenseVote } from '../restaurant/RestaurantLenseVote'
import { RestaurantReview } from '../restaurant/RestaurantReview'

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
          maxWidth={pageWidthMax * 0.55}
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
        <ScrollView
          style={{
            width: '100%',
            flex: 1,
            height: '100%',
          }}
          contentContainerStyle={{
            minHeight: '100%',
          }}
        >
          <VStack padding={18} spacing="lg" flex={1}>
            <SmallTitle fontWeight="600">Review {restaurant.name}</SmallTitle>

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
      const { review, upsertReview, deleteReview } = useUserReviewCommentQuery(
        restaurantId
      )
      const restaurant = useRestaurantQuery(restaurantSlug)
      const [reviewText, setReviewText] = useState('')
      const [isSaved, setIsSaved] = useState(false)
      const lineHeight = 22
      const [height, setHeight] = useState(lineHeight)
      const dishTags = restaurantDishesWithPhotos(restaurant)
      const [sentiments, setSentiments] = useState([])

      useDebounceEffect(
        () => {
          let isMounted = true

          // TODO: Split review into sentences matching each tag
          //const allTagNames = [...dishTags, ...tagLenses].map((x) => x.name)
          //const aspects = allTagNames.map((name) => name.toLowerCase())

          fetchBertSentiment(reviewText).then((tagSentiments) => {
            if (!isMounted) return
            console.log('got sentiments', tagSentiments)
          })

          return () => {
            isMounted = false
          }
        },
        1000,
        [reviewText]
      )

      useEffect(() => {
        if (review?.text) {
          setReviewText(review.text)
        }
      }, [review?.text])

      if (!user) {
        console.warn('no user')
        return null
      }

      return (
        <VStack minHeight="100%">
          <CommentBubble
            name={user.username ?? ''}
            after={
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
                placeholder="Write a comment. You can just leave a tip or a whole review, up to you."
                style={{
                  borderWidth: 1,
                  borderColor: '#ddd',
                  borderRadius: 10,
                  minHeight: height,
                  lineHeight: 22,
                  fontSize: 16,
                  width: '100%',
                  padding: 15,
                }}
              />
            }
          />

          <LinkButton
            {...flatButtonStyle}
            disabled={isSaved}
            alignSelf="center"
            fontWeight="700"
            marginVertical={10}
            onPress={() => {
              upsertReview({
                text: reviewText,
              })
              setIsSaved(true)
            }}
          >
            Save
          </LinkButton>

          <SmallTitle divider="center">Votes</SmallTitle>
          <Spacer />
          <HStack spacing="xl">
            <VStack
              borderWidth={1}
              borderColor="#eee"
              borderRadius={10}
              paddingHorizontal={45}
              paddingVertical={15}
              flex={1}
              spacing
            >
              <SmallTitle divider="off">Lenses</SmallTitle>
              <Suspense fallback={null}>
                <RestaurantLenseVote restaurantId={restaurantId} />
              </Suspense>
            </VStack>

            <VStack
              borderWidth={1}
              borderColor="#eee"
              borderRadius={10}
              paddingTop={15}
              flex={1}
              spacing
            >
              <SmallTitle divider="off">Dishes</SmallTitle>
              <ScrollView style={{ width: '100%' }}>
                <HStack
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  padding={15}
                >
                  {dishTags.map((tag) => {
                    return (
                      <TagSmallButton
                        tag={tag as any}
                        restaurantId={restaurantId}
                        key={tag.name}
                        image={
                          <Image
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 100,
                            }}
                            source={{ uri: tag.image }}
                          />
                        }
                      />
                    )
                  })}
                </HStack>
              </ScrollView>
            </VStack>
          </HStack>

          {review && (
            <>
              <Spacer size="xl" />
              <VStack
                borderWidth={1}
                borderColor="#eee"
                borderRadius={10}
                padding={15}
                flex={1}
              >
                <SmallTitle divider="off">Saved review</SmallTitle>
                <Suspense fallback={<LoadingItem />}>
                  <RestaurantReview
                    hideUsername
                    refetchKey={review.text}
                    reviewId={review.id}
                  />
                </Suspense>
                <SmallButton
                  alignSelf="flex-end"
                  onPress={() => {
                    if (
                      confirm('Are you sure you want to delete the review?')
                    ) {
                      deleteReview()
                    }
                  }}
                >
                  Delete
                </SmallButton>
              </VStack>
            </>
          )}
        </VStack>
      )
    }
  )
)
