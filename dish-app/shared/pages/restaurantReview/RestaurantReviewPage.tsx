import { graphql, query, reviewAnalyze } from '@dish/graph'
import { fetchBertSentiment } from '@dish/helpers'
import { getStore } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Image, ScrollView, TextInput } from 'react-native'
import {
  AbsoluteVStack,
  HStack,
  LoadingItem,
  LoadingItems,
  Modal,
  SmallTitle,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
} from 'snackui'

import { getRestuarantDishes } from '../../helpers/getRestaurantDishes'
import { useRestaurantQuery } from '../../hooks/useRestaurantQuery'
import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { TagVoteStore } from '../../hooks/useUserTagVotes'
import { HomeStateItemReview } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { tagLenses } from '../../state/tagLenses'
import { CommentBubble } from '../../views/CommentBubble'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { TagSmallButton } from '../../views/TagSmallButton'
import { LinkButton } from '../../views/ui/LinkButton'
import { SmallButton } from '../../views/ui/SmallButton'
import { RestaurantLenseVote } from '../restaurant/RestaurantLenseVote'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { SentimentText } from '../restaurant/SentimentText'

export default memo(function RestaurantReviewPage() {
  const om = useOvermind()
  const state = om.state.home.currentState

  if (state.type === 'restaurantReview') {
    return (
      <AbsoluteVStack
        className="inset-shadow-xxxl ease-in-out-slow"
        fullscreen
        zIndex={10000000000}
        alignItems="center"
        justifyContent="center"
        paddingHorizontal="2%"
        paddingVertical="2%"
        backgroundColor="rgba(60,30,50,0.9)"
        transform={[{ translateY: 0 }]}
      >
        <VStack
          width="100%"
          height="100%"
          borderWidth={1}
          position="relative"
          backgroundColor="#fff"
          borderRadius={15}
          shadowColor="#000"
          shadowRadius={150}
          shadowOffset={{ height: 10, width: 0 }}
          pointerEvents="auto"
          maxWidth={900}
          maxHeight={720}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              maxWidth: '100%',
            }}
            contentContainerStyle={{
              maxWidth: '100%',
            }}
          >
            <VStack
              flex={1}
              maxWidth="100%"
              overflow="hidden"
              alignItems="center"
            >
              <AbsoluteVStack zIndex={10} top={5} right={32}>
                <StackViewCloseButton />
              </AbsoluteVStack>
              <Suspense fallback={<LoadingItems />}>
                <HomePageReviewContent state={state} />
              </Suspense>
            </VStack>
          </ScrollView>
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
      <VStack width="100%" maxWidth="100%" padding={18} spacing="lg" flex={1}>
        <SmallTitle fontWeight="600">Review {restaurant.name}</SmallTitle>

        <Suspense fallback={<LoadingItems />}>
          <RestaurantReviewCommentForm
            restaurantSlug={state.restaurantSlug}
            restaurantId={restaurant.id}
          />
        </Suspense>
      </VStack>
    )
  })
)

export const RestaurantReviewCommentForm = memo(
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
      const [reviewText, setReviewText] = useState('')
      const [isSaved, setIsSaved] = useState(false)
      const lineHeight = 22
      const [height, setHeight] = useState(lineHeight)
      const dishTags = getRestuarantDishes({ restaurantSlug })

      useDebounceEffect(
        () => {
          let isMounted = true

          reviewAnalyze({
            text: reviewText,
            restaurantId,
          }).then((res) => {
            console.log('got', res)
            // getStore(TagVoteStore)
          })

          return () => {
            isMounted = false
          }
        },
        3000,
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
            afterName={
              <HStack marginVertical={-10} flex={1}>
                <Spacer flex={1} />
                <SmallButton
                  accessible
                  accessibilityRole="button"
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
                </SmallButton>
              </HStack>
            }
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
                numberOfLines={5}
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

          <Suspense fallback={null}>
            <UserReviewVotesRow restaurantId={restaurantId} userId={user?.id} />
          </Suspense>

          <Spacer />

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
                <RestaurantLenseVote restaurantSlug={restaurantSlug} />
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
              <ScrollView style={{ width: '100%', maxHeight: 300 }}>
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
                        restaurantSlug={restaurantSlug}
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

const UserReviewVotesRow = graphql(
  ({ restaurantId, userId }: { restaurantId: string; userId: string }) => {
    const allVotes =
      restaurantId && !!userId
        ? query.review({
            where: {
              restaurant_id: {
                _eq: restaurantId,
              },
              user_id: {
                _eq: userId,
              },
              type: {
                _eq: 'vote',
              },
            },
          })
        : []
    return (
      <HStack padding={10} alignItems="center" flexWrap="wrap">
        <Text color="#999">Saved votes:</Text>
        <Spacer />
        {allVotes.map((vote) => {
          return (
            <SentimentText
              marginRight={4}
              key={vote.id}
              sentiment={vote.vote ?? 0}
            >
              {vote.tag.name}
            </SentimentText>
          )
        })}
      </HStack>
    )
  }
)
