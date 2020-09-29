import { graphql } from '@dish/graph'
import {
  Circle,
  Divider,
  HStack,
  LoadingItem,
  LoadingItems,
  Spacer,
  Text,
  VStack,
} from '@dish/ui'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { Image } from 'react-native'

import { StackItemProps } from '../../AppStackView'
import { HomeStateItemUser } from '../../state/home-types'
import { useOvermind } from '../../state/om'
import { ContentScrollView } from '../../views/ContentScrollView'
import { NotFoundPage } from '../../views/NotFoundPage'
import { StackDrawer } from '../../views/StackDrawer'
import { SmallButton } from '../../views/ui/SmallButton'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { avatar } from '../search/avatar'
import { useUserQuery } from './useUserQuery'

type UserTab = 'vote' | 'review'

export default function UserPageContainer(
  props: StackItemProps<HomeStateItemUser>
) {
  const [tab, setTab] = useState<UserTab>('review')
  return (
    <StackDrawer closable title={`${props.item.username} | Dish food reviews`}>
      <Suspense
        fallback={
          <VStack height={125} borderColor="#eee" borderBottomWidth={1}>
            <LoadingItem lines={2} />
          </VStack>
        }
      >
        <UserHeader {...props} setTab={setTab} tab={tab} />
      </Suspense>
      <Suspense fallback={<LoadingItems />}>
        <UserPageContent {...props} tab={tab} />
      </Suspense>
    </StackDrawer>
  )
}

const UserPageContent = graphql(
  ({
    item,
    tab,
    isActive,
  }: StackItemProps<HomeStateItemUser> & {
    tab: UserTab
  }) => {
    const om = useOvermind()
    const user = useUserQuery(item?.username ?? '')
    const reviews = user
      .reviews({
        limit: 50,
      })
      .map((x) => ({
        id: x.id,
        restaurantId: x.restaurant.id,
        restaurantSlug: x.restaurant.slug,
        type: !!x.text ? 'review' : 'vote',
      }))

    useEffect(() => {
      if (!reviews.length || reviews[0] === null) return
      const userState = om.state.home.allStates[item.id] as HomeStateItemUser
      console.log('we here', item.id, userState)
      if (userState) {
        om.actions.home.updateHomeState({
          ...userState,
          results: reviews.map(({ restaurantId, restaurantSlug }) => {
            return {
              id: restaurantId,
              slug: restaurantSlug,
            }
          }),
        })
      }
    }, [reviews])

    if (!user) {
      return <NotFoundPage />
    }

    const hasReviews = !!reviews.length && reviews[0].id !== null

    return (
      <ContentScrollView paddingTop={0}>
        <VStack spacing="xl" paddingHorizontal="2.5%" paddingVertical={20}>
          <VStack>
            <Suspense fallback={<LoadingItems />}>
              {!hasReviews && <Text>No reviews yet...</Text>}
              {hasReviews &&
                reviews
                  .filter((x) => x.type === tab)
                  .map(({ id }) => (
                    <RestaurantReview showRestaurant key={id} reviewId={id} />
                  ))}
            </Suspense>
          </VStack>
        </VStack>
      </ContentScrollView>
    )
  }
)

const UserHeader = memo(
  graphql(
    ({
      item,
      tab,
      setTab,
    }: StackItemProps<HomeStateItemUser> & {
      setTab: Function
      tab: UserTab
    }) => {
      const user = useUserQuery(item?.username ?? '')
      return (
        <VStack maxWidth="100%" overflow="hidden" width="100%">
          <VStack padding={18}>
            <HStack alignItems="center" flex={1} position="relative">
              <Circle size={94} marginVertical={-10}>
                <Image
                  source={{ uri: avatar }}
                  style={{ backgroundColor: 'red', width: 94, height: 94 }}
                />
              </Circle>
              <Spacer size={20} />
              <VStack flex={1}>
                <Text fontSize={28} fontWeight="bold" paddingRight={30}>
                  {user.username ?? ''}
                </Text>
                <Spacer size={4} />
                <Text color="#777" fontSize={13}>
                  {user.username}
                </Text>
                <Spacer size={12} />
              </VStack>

              <HStack spacing>
                <SmallButton
                  isActive={tab === 'review'}
                  onPress={() => {
                    setTab('review')
                  }}
                >
                  Reviews
                </SmallButton>
                <SmallButton
                  isActive={tab === 'vote'}
                  onPress={() => {
                    setTab('vote')
                  }}
                >
                  Votes
                </SmallButton>
              </HStack>
            </HStack>
            <Divider />
          </VStack>
        </VStack>
      )
    }
  )
)
