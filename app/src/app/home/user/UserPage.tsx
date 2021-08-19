import { ReviewQuery, graphql, order_by, query } from '@dish/graph'
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
  useTheme,
} from 'snackui'

import { queryUser } from '../../../queries/queryUser'
import { router } from '../../../router'
import { HomeStateItemUser } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMap'
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { ListCard } from '../../views/list/ListCard'
import { NotFoundPage } from '../../views/NotFoundPage'
import { SmallButton } from '../../views/SmallButton'
import { SmallTitle } from '../../views/SmallTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { CardCarousel } from './CardCarousel'
import { UserAvatar } from './UserAvatar'

type UserPane = 'vote' | 'review' | ''

export default function UserPageContainer(props: StackItemProps<HomeStateItemUser>) {
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
      <Suspense fallback={<LoadingItems />}>
        <UserPageContent {...props} setPane={setPane} pane={pane} />
      </Suspense>
    </StackDrawer>
  )
}

const getReviewRestuarants = (x: ReviewQuery) => {
  return {
    id: x.restaurant?.id,
    slug: x.restaurant?.slug,
  }
}

const UserPageContent = graphql(
  (props: StackItemProps<HomeStateItemUser> & { pane: UserPane | null; setPane: Function }) => {
    const { item, isActive, pane, setPane } = props
    const username = item.username
    if (!username) {
      return null
    }
    const user = queryUser(username)
    const lists = user.lists({
      limit: 10,
      where: {
        public: {
          _eq: true,
        },
      },
      order_by: [{ created_at: order_by.desc }],
    })
    // not doing this nested until hasura fixes:
    // https://github.com/hasura/graphql-engine/issues/5745
    const reviews = query.review({
      where: {
        username: {
          _eq: username,
        },
        restaurant_id: {
          _is_null: false,
        },
        ...(pane === 'review' && {
          text: { _neq: '' },
        }),
        ...(pane === 'vote' && {
          text: { _eq: '' },
        }),
      },
      limit: 10,
      order_by: [{ updated_at: order_by.desc }],
    })

    const hasReviews = !!reviews?.length

    useSnapToFullscreenOnMount()

    useSetAppMap({
      hideRegions: true,
      fitToResults: true,
      isActive,
      results: reviews.map(getReviewRestuarants).filter((x) => x.id),
    })

    if (!user) {
      return <NotFoundPage />
    }

    return (
      <ContentScrollView id="user">
        <PageContentWithFooter>
          <Suspense
            fallback={
              <VStack height={160} borderColor="#eee" borderBottomWidth={1}>
                <LoadingItem lines={2} />
              </VStack>
            }
          >
            <UserHeader {...props} setPane={setPane} pane={pane} />
          </Suspense>

          <VStack spacing="lg" paddingVertical={20}>
            {!!user.about && (
              <VStack>
                <SmallTitle>About</SmallTitle>
                <Paragraph size="lg">{user.about}</Paragraph>
              </VStack>
            )}

            <CardCarousel>
              {lists.map((list, i) => {
                return (
                  <ListCard
                    // zIndex={1000 - i}
                    size="lg"
                    floating
                    key={list.slug || i}
                    userSlug={list.user?.username ?? ''}
                    slug={list.slug || ''}
                  />
                )
              })}
            </CardCarousel>

            <VStack paddingHorizontal={20}>
              <Suspense fallback={<LoadingItems />}>
                {!hasReviews && <Text>No reviews yet...</Text>}
                {hasReviews && reviews.map(({ id }) => <RestaurantReview key={id} reviewId={id} />)}
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
      const theme = useTheme()

      if (!user) {
        return null
      }

      return (
        <VStack position="relative">
          <VStack flex={1} paddingHorizontal={20} paddingTop={25}>
            <HStack alignItems="center" flex={1} position="relative">
              <VStack marginVertical={-10} marginRight={10}>
                <UserAvatar avatar={user.avatar ?? ''} charIndex={user.charIndex ?? 0} />
              </VStack>
              <VStack flex={1}>
                <Text color={theme.color} fontSize={22} fontWeight="700" paddingRight={30}>
                  {user.name ?? user.username ?? 'no-name'}
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
                  borderRadius={0}
                  borderWidth={0}
                  theme={!pane ? 'active' : null}
                  onPress={() => {
                    setPane()
                  }}
                >
                  Profile
                </SmallButton>
                <SmallButton
                  borderRadius={0}
                  borderWidth={0}
                  theme={pane === 'review' ? 'active' : null}
                  onPress={() => {
                    setPane('review')
                  }}
                >
                  Reviews
                </SmallButton>
                <SmallButton
                  borderRadius={0}
                  borderWidth={0}
                  theme={pane === 'vote' ? 'active' : null}
                  onPress={() => {
                    setPane('vote')
                  }}
                >
                  Votes
                </SmallButton>
              </InteractiveContainer>
            </HStack>

            <Spacer />

            <Divider />
          </VStack>

          {isOwnProfile && (
            <AbsoluteVStack zIndex={10} bottom={-15} right={10}>
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
