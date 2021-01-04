import { graphql } from '@dish/graph'
import React, { Suspense, memo, useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import {
  Divider,
  HStack,
  LoadingItem,
  LoadingItems,
  Paragraph,
  SmallTitle,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { useHomeStore } from '../../state/home'
import { HomeStateItemUser } from '../../state/home-types'
import { useUserStore } from '../../state/userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { NotFoundPage } from '../../views/NotFoundPage'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { UserAvatar } from './UserAvatar'
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
          <VStack height={160} borderColor="#eee" borderBottomWidth={1}>
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
    const home = useHomeStore()
    const user = useUserQuery(item?.username ?? '')
    const reviews = user
      ?.reviews({
        limit: 50,
      })
      .map((x) => ({
        id: x.id,
        restaurantId: x.restaurant.id,
        restaurantSlug: x.restaurant.slug,
        type: !!x.text ? 'review' : 'vote',
      }))

    useEffect(() => {
      if (!reviews || !reviews.length || reviews[0] === null) return
      const userState = home.allStates[item.id] as HomeStateItemUser
      console.log('we here', item.id, userState)
      if (userState) {
        home.updateHomeState({
          id: userState.id,
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

    const hasReviews = !!reviews?.length && reviews[0].id !== null

    return (
      <ContentScrollView id="user">
        <VStack spacing="xl" paddingHorizontal="2.5%" paddingVertical={20}>
          <VStack>
            {tab === 'review' && (
              <VStack>
                {user.about && (
                  <VStack>
                    <SmallTitle>About</SmallTitle>
                    <Paragraph size="lg">{user.about}</Paragraph>
                  </VStack>
                )}
              </VStack>
            )}

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
      const userStore = useUserStore()
      const user = useUserQuery(item?.username ?? '')
      const isOwnProfile = userStore.user?.username === user?.username
      console.log(userStore.user?.username, user?.username)

      if (!user) return null

      return (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{
            minWidth: '100%',
          }}
        >
          <VStack maxWidth="100%" width="100%">
            <VStack flex={1} padding={18}>
              <HStack alignItems="center" flex={1} position="relative">
                <VStack marginTop={-10} marginBottom={5}>
                  <UserAvatar
                    avatar={user.avatar ?? ''}
                    charIndex={user.charIndex ?? 0}
                  />
                </VStack>
                <Spacer size={20} />
                <VStack flex={1}>
                  <Text fontSize={28} fontWeight="bold" paddingRight={30}>
                    {user.username ?? 'no-name'}
                  </Text>
                  <Spacer size={4} />
                  <Text color="#777" fontSize={14}>
                    {user.location ?? 'Earth, Universe'}
                  </Text>
                  {isOwnProfile && (
                    <>
                      <Spacer />
                      <Link name="userEdit">Edit profile</Link>
                    </>
                  )}
                  <Spacer size={12} />
                </VStack>

                <VStack flex={1} minWidth={20} />

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
        </ScrollView>
      )
    }
  )
)
