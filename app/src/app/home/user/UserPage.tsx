import { ReviewQuery, graphql, order_by, query, useQuery } from '@dish/graph'
import { Plus } from '@dish/react-feather'
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

import { getTimeFormat } from '../../../helpers/getTimeFormat'
import { pluralize } from '../../../helpers/pluralize'
import { queryUser } from '../../../queries/queryUser'
import { router } from '../../../router'
import { HomeStateItemUser } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMap'
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { ListCard } from '../../views/list/ListCard'
import { Middot } from '../../views/Middot'
import { NotFoundPage } from '../../views/NotFoundPage'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'
import { SmallTitle } from '../../views/SmallTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { RestaurantReview } from '../restaurant/RestaurantReview'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { CardCarousel } from './CardCarousel'
import { characters } from './characters'
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
      limit: !pane ? 10 : 30,
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

    const favoritesCount =
      user
        .reviews_aggregate({
          where: {
            favorited: {
              _eq: true,
            },
          },
        })
        .aggregate?.count({}) ?? 0

    const votesCount =
      user
        .reviews_aggregate({
          where: {
            text: { _eq: '' },
            restaurant_id: {
              _is_null: false,
            },
          },
        })
        .aggregate?.count({}) ?? 0

    const reviewsCount =
      user
        .reviews_aggregate({
          where: {
            text: { _neq: '' },
            restaurant_id: {
              _is_null: false,
            },
          },
        })
        .aggregate?.count({}) ?? 0

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
            <UserHeader {...props} />
          </Suspense>

          <Spacer />

          <HStack spacing justifyContent="center">
            <SmallButton
              textProps={{
                fontWeight: '800',
              }}
              theme={!pane ? 'active' : null}
              onPress={() => {
                setPane()
              }}
            >
              Recently
            </SmallButton>
            <SmallButton
              textProps={{
                fontWeight: '800',
              }}
              theme={pane === 'review' ? 'active' : null}
              onPress={() => {
                setPane('review')
              }}
            >
              Reviews
            </SmallButton>
            <SmallButton
              textProps={{
                fontWeight: '800',
              }}
              theme={pane === 'vote' ? 'active' : null}
              onPress={() => {
                setPane('vote')
              }}
            >
              Votes
            </SmallButton>
          </HStack>

          <Spacer size="lg" />

          <VStack>
            <Divider />
            <Spacer />
            <HStack spacing alignItems="center" justifyContent="center">
              <Paragraph size="xl" fontWeight="700">
                {characters[user.charIndex ?? 0] ?? '👻'}
              </Paragraph>
              <Paragraph size="xl" opacity={0.5}>
                {pluralize(votesCount, 'vote')}
              </Paragraph>
              <Middot />
              <Paragraph size="xl" opacity={0.5}>
                {pluralize(reviewsCount, 'review')}
              </Paragraph>
              <Middot />
              <Paragraph size="xl" opacity={0.5}>
                {pluralize(favoritesCount, 'favorite')}
              </Paragraph>
            </HStack>
            <Spacer />
            <Divider />
          </VStack>

          <Spacer size="lg" />

          <VStack spacing="lg" paddingVertical={20}>
            {!pane && !!user.about && (
              <VStack>
                <SmallTitle>About</SmallTitle>
                <Paragraph size="lg">{user.about}</Paragraph>
              </VStack>
            )}

            {!pane && !!lists.length && (
              <VStack paddingHorizontal={10} position="relative">
                <AbsoluteVStack zIndex={100} top={-15} left={10}>
                  <SlantedTitle size="xs">Playlists</SlantedTitle>
                </AbsoluteVStack>
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
              </VStack>
            )}

            <VStack position="relative" paddingHorizontal={20}>
              <Suspense fallback={<LoadingItems />}>
                <AbsoluteVStack zIndex={100} top={-15} left={10}>
                  <SlantedTitle size="xs">
                    {pane === 'review' ? 'Reviews' : pane === 'vote' ? 'Votes' : 'Recently'}
                  </SlantedTitle>
                </AbsoluteVStack>

                <VStack paddingVertical={25}>
                  {!hasReviews && <Paragraph padding={30}>None yet...</Paragraph>}
                  {hasReviews &&
                    reviews.map(({ id }) => <RestaurantReview key={id} reviewId={id} />)}
                </VStack>
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
    }: StackItemProps<HomeStateItemUser> & {
      setPane: Function
      pane: UserPane | null
    }) => {
      const username = item?.username ?? ''
      const userStore = useUserStore()
      const user = queryUser(username)
      const isOwnProfile = userStore.user?.username === username
      const date = user.created_at

      if (!user) {
        return null
      }

      return (
        <VStack position="relative">
          <PaneControlButtonsLeft>
            {isOwnProfile && (
              <Link name="userEdit">
                <SmallButton elevation={1}>Edit profile</SmallButton>
              </Link>
            )}
            <UserSubscribeButton elevation={1} username={username} />
          </PaneControlButtonsLeft>

          <VStack flex={1} paddingHorizontal={20} paddingTop={30}>
            <HStack alignItems="flex-end" flex={1} position="relative">
              <VStack marginBottom={-30} marginRight={10}>
                <UserAvatar size={160} avatar={user.avatar ?? ''} charIndex={user.charIndex ?? 0} />
              </VStack>
              <VStack flex={1}>
                <Paragraph size="xxxxl" paddingRight={30}>
                  {user.name ?? user.username ?? 'no-name'}
                </Paragraph>
                <Spacer size={4} />
                <HStack>
                  <Paragraph opacity={0.5}>
                    From {user.location?.trim() || 'planet earth'}
                  </Paragraph>

                  {!!date && (
                    <>
                      <Spacer />
                      <Middot />
                      <Spacer />
                      <Paragraph opacity={0.5}>Joined {getTimeFormat(new Date(date))}</Paragraph>
                    </>
                  )}
                </HStack>
                <Spacer size={12} />
              </VStack>
            </HStack>

            <Spacer />

            <Divider />
          </VStack>
        </VStack>
      )
    }
  )
)

const UserSubscribeButton = ({ username, ...rest }: SmallButtonProps & { username: string }) => {
  const user = queryUser(username)
  const theme = useTheme()

  return (
    <SmallButton
      tooltip="Follow user"
      borderRadius={100}
      icon={<Plus color={theme.color} size={16} />}
      onPress={() => {}}
      {...rest}
    >
      Subscribe
    </SmallButton>
  )
}
