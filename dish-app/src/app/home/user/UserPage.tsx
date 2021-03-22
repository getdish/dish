import { ReviewQuery, UserQuery, graphql, order_by } from '@dish/graph'
import { useRouterSelector } from '@dish/router'
import React, { Suspense, memo } from 'react'
import {
  AbsoluteVStack,
  Button,
  Divider,
  HStack,
  InteractiveContainer,
  LoadingItem,
  LoadingItems,
  Paragraph,
  Spacer,
  Text,
  VStack,
} from 'snackui'

import { queryUser } from '../../../queries/queryUser'
import { router } from '../../../router'
import { HomeStateItemUser } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMapStore'
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { ContentScrollViewHorizontal } from '../../views/ContentScrollViewHorizontal'
import { Link } from '../../views/Link'
import { ListCard } from '../../views/list/ListCard'
import { NotFoundPage } from '../../views/NotFoundPage'
import { SmallButton } from '../../views/SmallButton'
import { SmallTitle } from '../../views/SmallTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { FeedSlantedTitle } from '../FeedSlantedTitle'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { SkewedCard, SkewedCardCarousel } from '../SkewedCard'
import { UserAvatar } from './UserAvatar'

type UserPane = 'vote' | 'review' | ''

export default function UserPageContainer(
  props: StackItemProps<HomeStateItemUser>
) {
  const pane = useRouterSelector((x) =>
    x.curPage.name === 'user' ? (x.curPage.params.pane as UserPane) : null
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
      <VStack flexShrink={0}>
        <Suspense
          fallback={
            <VStack height={160} borderColor="#eee" borderBottomWidth={1}>
              <LoadingItem lines={2} />
            </VStack>
          }
        >
          <UserHeader {...props} setPane={setPane} pane={pane} />
        </Suspense>
      </VStack>

      <VStack flex={1} flexShrink={0}>
        <Suspense fallback={<LoadingItems />}>
          <UserPageContent {...props} pane={pane} />
        </Suspense>
      </VStack>
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
  }: StackItemProps<HomeStateItemUser> & { pane: UserPane | null }) => {
    const user = queryUser(item.username ?? '')
    const lists = user.lists({
      limit: 10,
      where: {
        public: {
          _eq: true,
        },
      },
      order_by: [{ created_at: order_by.desc }],
    })
    const reviews = useUserReviews(user, pane || 'both')
    const hasReviews = !!reviews?.length

    useSnapToFullscreenOnMount()

    useSetAppMap({
      hideRegions: true,
      isActive: isActive,
      results: reviews.map(getReviewRestuarants),
    })

    if (!user) {
      return <NotFoundPage />
    }

    return (
      <ContentScrollView id="user">
        <PageContentWithFooter>
          <VStack spacing="xl" paddingVertical={20}>
            <VStack>
              {!!user.about && (
                <VStack>
                  <SmallTitle>About</SmallTitle>
                  <Paragraph size="lg">{user.about}</Paragraph>
                </VStack>
              )}

              <FeedSlantedTitle>Lists</FeedSlantedTitle>
              <SkewedCardCarousel>
                {lists.map((list, i) => {
                  return (
                    <SkewedCard zIndex={1000 - i} key={list.slug || i}>
                      <ListCard
                        isBehind={i > 0}
                        userSlug={list.user?.username ?? ''}
                        slug={list.slug}
                        region={list.region ?? ''}
                      />
                    </SkewedCard>
                  )
                })}
              </SkewedCardCarousel>

              <FeedSlantedTitle>Recently</FeedSlantedTitle>
              <Spacer size="xxxl" />
              <Suspense fallback={<LoadingItems />}>
                {!hasReviews && <Text>No reviews yet...</Text>}
                {hasReviews && (
                  <VStack>
                    {reviews.map(({ id }) => (
                      <RestaurantReview key={id} reviewId={id} />
                    ))}
                  </VStack>
                )}
              </Suspense>
            </VStack>
          </VStack>
        </PageContentWithFooter>
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
      pane: UserPane | null
    }) => {
      const userStore = useUserStore()
      const user = queryUser(item?.username ?? '')
      const isOwnProfile = userStore.user?.username === user?.username

      if (!user) {
        return null
      }

      return (
        <VStack position="relative">
          <ContentScrollViewHorizontal>
            <VStack maxWidth="100%" width="100%">
              <VStack flex={1} padding={20} paddingVertical={25}>
                <HStack alignItems="center" flex={1} position="relative">
                  <VStack marginTop={-10} marginBottom={5} marginRight={10}>
                    <UserAvatar
                      avatar={user.avatar ?? ''}
                      charIndex={user.charIndex ?? 0}
                    />
                  </VStack>
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

                  <InteractiveContainer>
                    <SmallButton
                      borderColor="transparent"
                      theme={!pane ? 'active' : null}
                      onPress={() => {
                        setPane()
                      }}
                    >
                      Profile
                    </SmallButton>
                    <SmallButton
                      borderColor="transparent"
                      theme={pane === 'review' ? 'active' : null}
                      onPress={() => {
                        setPane('review')
                      }}
                    >
                      Reviews
                    </SmallButton>
                    <SmallButton
                      borderColor="transparent"
                      theme={pane === 'vote' ? 'active' : null}
                      onPress={() => {
                        setPane('vote')
                      }}
                    >
                      Votes
                    </SmallButton>
                  </InteractiveContainer>
                </HStack>

                <Divider />
              </VStack>
            </VStack>
          </ContentScrollViewHorizontal>

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
