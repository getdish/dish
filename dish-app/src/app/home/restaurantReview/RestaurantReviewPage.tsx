import { graphql, query, refetch, reviewAnalyze } from '@dish/graph'
import { useStoreInstance } from '@dish/use-store'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Image, ScrollView, TextInput } from 'react-native'
import {
  HStack,
  LoadingItems,
  Modal,
  Spacer,
  Text,
  VStack,
  useDebounceEffect,
} from 'snackui'

import { red } from '../../../constants/colors'
import { getRestaurantDishes } from '../../../helpers/getRestaurantDishes'
import { queryRestaurant } from '../../../queries/queryRestaurant'
import { HomeStateItemReview } from '../../../types/homeTypes'
import { AuthForm } from '../../AuthForm'
import { homeStore, useIsHomeTypeActive } from '../../homeStore'
import { useUserReviewCommentQuery } from '../../hooks/useUserReview'
import { useUserStore } from '../../userStore'
import { CommentBubble } from '../../views/CommentBubble'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { SmallButton } from '../../views/SmallButton'
import { SmallTitle } from '../../views/SmallTitle'
import { StackViewCloseButton } from '../../views/StackViewCloseButton'
import { TagSmallButton } from '../../views/TagSmallButton'
import { RestaurantLenseVote } from '../restaurant/RestaurantLenseVote'
import { SentimentText } from '../restaurant/SentimentText'

export default memo(function RestaurantReviewPage() {
  const isActive = useIsHomeTypeActive('restaurantReview')
  if (!isActive) return null
  return <RestaurantReviewPageContent />
})

function RestaurantReviewPageContent() {
  const store = useStoreInstance(homeStore)
  const state = store.getLastStateByType('restaurantReview')
  return (
    <Modal width="98%" maxWidth={700} visible>
      <PaneControlButtons>
        <StackViewCloseButton />
      </PaneControlButtons>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          maxWidth: '100%',
        }}
        contentContainerStyle={{
          maxWidth: '100%',
        }}
      >
        <VStack flex={1} maxWidth="100%" alignItems="center">
          <Suspense fallback={<LoadingItems />}>
            <HomePageReviewContent state={state} />
          </Suspense>
        </VStack>
      </ScrollView>
    </Modal>
  )
}

const HomePageReviewContent = memo(
  graphql(function HomePageReviewContent({
    state,
  }: {
    state: HomeStateItemReview
  }) {
    if (!state.restaurantSlug) {
      return (
        <VStack>
          <Text>no slug?</Text>
        </VStack>
      )
    }

    const [restaurant] = queryRestaurant(state.restaurantSlug)

    if (!restaurant) {
      return null
    }

    return (
      <VStack width="100%" maxWidth="100%" padding={18} spacing="lg" flex={1}>
        <SmallTitle fontWeight="600">{restaurant.name}</SmallTitle>

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
      const user = useUserStore().user
      const {
        review,
        upsertReview,
        deleteReview,
        reviewsQuery,
      } = useUserReviewCommentQuery(restaurantId, {
        onUpsert: () => {
          refetch(reviewsQuery).catch(console.error)
        },
        onDelete: () => {
          refetch(reviewsQuery).catch(console.error)
        },
      })
      const [reviewText, setReviewText] = useState('')
      const [isSaved, setIsSaved] = useState(false)
      const lineHeight = 22
      const [height, setHeight] = useState(lineHeight)
      const dishTags = getRestaurantDishes({ restaurantSlug })

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
        return <AuthForm />
      }

      return (
        <VStack minHeight="100%">
          <CommentBubble
            name={user.username ?? ''}
            avatar={''}
            text={
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
                placeholder="A note, a tip, a whole review, it's up to you."
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
            after={
              <HStack flex={1}>
                <Suspense fallback={null}>
                  <UserReviewVotesRow
                    restaurantId={restaurantId}
                    userId={user?.id}
                  />
                </Suspense>
                <VStack flex={1} />
                <HStack
                  alignItems="center"
                  justifyContent="center"
                  marginVertical={-10}
                  flex={1}
                >
                  <Spacer flex={1} />
                  <SmallButton
                    accessible
                    accessibilityRole="button"
                    // TODO use theme?
                    textProps={{
                      color: red,
                    }}
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
                  <Spacer size="sm" />
                  <SmallButton
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
                </HStack>
              </HStack>
            }
          />

          <Spacer />

          <SmallTitle divider="center">Votes</SmallTitle>
          <Spacer />
          <HStack spacing="xl">
            <VStack
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

            <VStack borderRadius={10} paddingTop={15} flex={1} spacing>
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

          {/* {review && (
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

              </VStack>
            </>
          )} */}
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
        <Text overflow="hidden" color="#999">
          Votes:
        </Text>
        <Spacer />
        <HStack spacing="xs">
          {allVotes.map((vote) => {
            return (
              <SentimentText
                marginRight={4}
                key={vote.id}
                sentiment={vote.vote ?? 0}
              >
                {vote.tag?.name}
              </SentimentText>
            )
          })}
        </HStack>
      </HStack>
    )
  }
)
