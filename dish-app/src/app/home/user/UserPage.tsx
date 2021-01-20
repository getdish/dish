import { ReviewQuery, UserQuery, graphql, order_by } from '@dish/graph'
import { useRouterSelector } from '@dish/router'
import React, { Suspense, memo } from 'react'
import { ScrollView } from 'react-native'
import {
  AbsoluteVStack,
  Button,
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

import { router } from '../../../router'
import { HomeStateItemUser } from '../../../types/homeTypes'
import { useSetAppMapResults } from '../../AppMapStore'
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { ListCard } from '../../views/list/ListCard'
import { NotFoundPage } from '../../views/NotFoundPage'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { CardCarousel } from './CardCarousel'
import { UserAvatar } from './UserAvatar'
import { useUserQuery } from './useUserQuery'

type UserPane = 'vote' | 'review' | ''

export default function UserPageContainer(
  props: StackItemProps<HomeStateItemUser>
) {
  const pane = useRouterSelector(
    (x) => x.curPage.name === 'user' && (x.curPage.params.pane as UserPane)
  )
  const setPane = (pane?: UserPane) => {
    router.navigate({
      name: 'user',
      params: {
        username: props.item.username,
        pane,
      },
    })
  }

  return (
    <StackDrawer closable title={`${props.item.username} | Dish food reviews`}>
      <Suspense
        fallback={
          <VStack height={160} borderColor="#eee" borderBottomWidth={1}>
            <LoadingItem lines={2} />
          </VStack>
        }
      >
        <UserHeader {...props} setPane={setPane} pane={pane} />
      </Suspense>
      <Suspense fallback={<LoadingItems />}>
        <UserPageContent {...props} pane={pane} />
      </Suspense>
    </StackDrawer>
  )
}

function useUserReviews(user: UserQuery, type: UserPane | 'both') {
  return user?.reviews({
    limit: 10,
    ...(type === 'review' && {
      where: { text: { _neq: '' } },
    }),
    ...(type === 'vote' && {
      where: { text: { _eq: '' } },
    }),
    order_by: [{ updated_at: order_by.desc }],
  })
}

const getReviewRestuarants = (x: ReviewQuery) => {
  return {
    id: x.restaurant.id,
    slug: x.restaurant.slug,
  }
}

const UserPageContent = graphql(
  ({
    item,
    isActive,
    pane,
  }: StackItemProps<HomeStateItemUser> & { pane: UserPane }) => {
    const user = useUserQuery(item.username ?? '')
    const lists = user.lists({
      limit: 10,
      where: {
        public: {
          _eq: true,
        },
      },
      order_by: [{ created_at: order_by.asc }],
    })
    const reviews = useUserReviews(user, pane || 'both')
    const hasReviews = !!reviews?.length

    useSetAppMapResults({
      isActive: isActive,
      results: reviews.map(getReviewRestuarants),
    })

    if (!user) {
      return <NotFoundPage />
    }

    return (
      <ContentScrollView id="user">
        <VStack spacing="xl" paddingHorizontal="2.5%" paddingVertical={20}>
          <VStack>
            {!!user.about && (
              <VStack>
                <SmallTitle>About</SmallTitle>
                <Paragraph size="lg">{user.about}</Paragraph>
              </VStack>
            )}

            <SlantedTitle>Lists</SlantedTitle>
            <CardCarousel>
              {lists.map((list) => {
                return (
                  <ListCard
                    key={list.slug}
                    userSlug={list.user.username}
                    slug={list.slug}
                  />
                )
              })}
            </CardCarousel>

            <SlantedTitle>Recently</SlantedTitle>

            <Suspense fallback={<LoadingItems />}>
              {!hasReviews && <Text>No reviews yet...</Text>}
              {hasReviews && (
                <VStack>
                  {reviews.map(({ id }) => (
                    <RestaurantReview key={id} showRestaurant reviewId={id} />
                  ))}
                </VStack>
              )}
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
      pane,
      setPane,
    }: StackItemProps<HomeStateItemUser> & {
      setPane: Function
      pane: UserPane
    }) => {
      const userStore = useUserStore()
      const user = useUserQuery(item?.username ?? '')
      const isOwnProfile = userStore.user?.username === user?.username

      if (!user) {
        return null
      }

      return (
        <VStack position="relative">
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
                    <HStack>
                      <Text color="#777" fontSize={14}>
                        {user.location?.trim() || 'Earth, Universe'}
                      </Text>
                    </HStack>
                    <Spacer size={12} />
                  </VStack>

                  <VStack flex={1} minWidth={20} />

                  <HStack spacing="sm">
                    <SmallButton
                      theme={!pane ? 'active' : null}
                      onPress={() => {
                        setPane()
                      }}
                    >
                      Profile
                    </SmallButton>
                    <SmallButton
                      theme={pane === 'review' ? 'active' : null}
                      onPress={() => {
                        setPane('review')
                      }}
                    >
                      Reviews
                    </SmallButton>
                    <SmallButton
                      theme={pane === 'vote' ? 'active' : null}
                      onPress={() => {
                        setPane('vote')
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
          {isOwnProfile && (
            <AbsoluteVStack zIndex={10} bottom={-10} right={10}>
              <Link name="userEdit">
                <Button>Edit profile</Button>
              </Link>
            </AbsoluteVStack>
          )}
        </VStack>
      )
    }
  )
)
