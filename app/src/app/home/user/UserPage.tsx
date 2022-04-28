import { getTimeFormat } from '../../../helpers/getTimeFormat'
import { queryUser } from '../../../queries/queryUser'
import { router } from '../../../router'
import { HomeStateItemUser } from '../../../types/homeTypes'
import { useSetAppMap } from '../../appMapStore'
import { useAsyncEffect } from '../../hooks/useAsync'
import { usePageLoadEffect } from '../../hooks/usePageLoadEffect'
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Image } from '../../views/Image'
import { Link } from '../../views/Link'
import { Middot } from '../../views/Middot'
import { NotFoundPage } from '../../views/NotFoundPage'
import { PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { Review } from '../../views/Review'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton, SmallButtonProps } from '../../views/SmallButton'
import { SmallTitle } from '../../views/SmallTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { SuspenseFallback } from '../../views/SuspenseFallback'
import { ListCard } from '../../views/list/ListCard'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { CardCarousel } from './CardCarousel'
import { UserAvatar } from './UserAvatar'
import { sleep } from '@dish/async'
import { ReviewQuery, graphql, order_by, query, useRefetch } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { useRouterSelector } from '@dish/router'
import {
  AbsoluteYStack,
  H1,
  LoadingItem,
  LoadingItems,
  Paragraph,
  ParagraphProps,
  Separator,
  Spacer,
  XStack,
  YStack,
  useLazyEffect,
  useMedia,
  useTheme,
} from '@dish/ui'
import { Plus } from '@tamagui/feather-icons'
import React, { Suspense, memo, useState } from 'react'

type UserPane = 'vote' | 'review' | '' | 'favorite'

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

function useQueryIsLoaded<A>(cb: (isLoaded: boolean) => A, opts?: { skeleton?: number }): A {
  const [loaded, setLoaded] = useState(false)
  const query = cb(loaded)
  // const skeleton = useMemo(() => query, [])
  const item = query?.[0]
  const exists = typeof item[Object.keys(item)[0]] !== 'undefined'
  if (!Array.isArray(query)) {
    return query
  }
  const numSkeletons = Math.min(0, 10 - query.length)
  // useEffect(() => {
  //   if (exists) {
  //     setLoaded(true)
  //   }
  // }, [exists])
  // @ts-ignore
  return query //[...query, ...(numSkeletons ? new Array(numSkeletons).fill(skeleton) : [])]
}

const UserPageContent = memo(
  graphql(
    (props: StackItemProps<HomeStateItemUser> & { pane: UserPane | null; setPane: Function }) => {
      const refetch = useRefetch()
      const { item, isActive, pane, setPane } = props
      const username = item.username
      const user = queryUser(username)
      const theme = useTheme()

      const [hasLoadedAboveFold, setHasLoadedAboveFold] = useState(false)

      useAsyncEffect(async (signal) => {
        await sleep(500)
        if (signal.aborted) return
        setHasLoadedAboveFold(true)
      }, [])

      // slow query hasLoadedAboveFold
      const lists = user?.lists({
        limit: 25,
        where: {
          public: {
            _eq: true,
          },
        },
        order_by: [{ created_at: order_by.desc }],
      })
      // useQueryIsLoaded(
      //   (loaded) =>
      //     user?.lists({
      //       limit: loaded ? 10 : 2,
      //       where: {
      //         public: {
      //           _eq: true,
      //         },
      //       },
      //       order_by: [{ created_at: order_by.desc }],
      //     }),
      //   {
      //     skeleton: 10,
      //   }
      // )
      // // always === 10, keeps skeletons
      // console.log('>>>>', lists)
      // lists.length === 10

      const favoriteLists = user
        ?.reviews({
          limit: 3,
          where: {
            list_id: {
              _is_null: false,
            },
            favorited: {
              _eq: true,
            },
          },
          order_by: [{ authored_at: order_by.desc }],
        })
        .flatMap((review) => review.list)
        .filter(isPresent)

      // not doing this nested until hasura fixes:
      // https://github.com/hasura/graphql-engine/issues/5745
      const reviews = query.review({
        where: {
          username: {
            _eq: username,
          },
          ...(pane === 'favorite' && {
            favorited: {
              _eq: true,
            },
          }),
          ...(pane === 'review' && {
            restaurant_id: {
              _is_null: false,
            },
            text: { _neq: '' },
          }),
          ...(pane === 'vote' && {
            text: { _eq: '' },
          }),
        },
        limit: !pane ? 3 : 40,
        order_by: [{ updated_at: order_by.desc }],
      })

      const hasReviews = !!reviews?.length

      useSnapToFullscreenOnMount()

      useSetAppMap({
        id: props.item.id,
        hideRegions: true,
        fitToResults: true,
        isActive,
        results: reviews.map(getReviewRestuarants).filter((x) => x.id),
      })

      // const favoritesCount =
      //   user
      //     ?.reviews_aggregate({
      //       where: {
      //         favorited: {
      //           _eq: true,
      //         },
      //       },
      //     })
      //     .aggregate?.count({}) ?? 0

      // const votesCount =
      //   user
      //     ?.reviews_aggregate({
      //       where: {
      //         text: { _eq: '' },
      //         restaurant_id: {
      //           _is_null: false,
      //         },
      //       },
      //     })
      //     .aggregate?.count({}) ?? 0

      // const reviewsCount =
      //   user
      //     ?.reviews_aggregate({
      //       where: {
      //         text: { _neq: '' },
      //         restaurant_id: {
      //           _is_null: false,
      //         },
      //       },
      //     })
      //     .aggregate?.count({}) ?? 0

      const refetchAll = () => {
        refetch(user)
        refetch(lists)
        refetch(favoriteLists)
      }

      usePageLoadEffect(props, ({ isRefreshing }) => {
        if (isRefreshing) {
          console.warn('testing refetch')
          refetchAll()
        }
      })

      // reload on back
      useLazyEffect(() => {
        if (props.isActive) {
          console.warn('testing refetch')
          refetchAll()
        }
      }, [props.isActive])

      if (!username || !user) {
        return <NotFoundPage />
      }

      return (
        <ContentScrollView id="user">
          <PageContentWithFooter>
            <Suspense
              fallback={
                <YStack height={160} borderColor="#eee" borderBottomWidth={1}>
                  <LoadingItem lines={2} />
                </YStack>
              }
            >
              <UserHeader {...props} />
            </Suspense>

            <Spacer />

            <XStack space="$2" justifyContent="center">
              <SmallButton
                fontWeight="800"
                theme={!pane ? 'active' : null}
                onPress={() => {
                  setPane()
                }}
              >
                Profile
              </SmallButton>
              <SmallButton
                fontWeight="800"
                theme={pane === 'review' ? 'active' : null}
                onPress={() => {
                  setPane('review')
                }}
              >
                Reviews
              </SmallButton>
              <SmallButton
                fontWeight="800"
                theme={pane === 'favorite' ? 'active' : null}
                onPress={() => {
                  setPane('favorite')
                }}
              >
                Favorites
              </SmallButton>
              <SmallButton
                fontWeight="800"
                theme={pane === 'vote' ? 'active' : null}
                onPress={() => {
                  setPane('vote')
                }}
              >
                Votes
              </SmallButton>
            </XStack>

            <Spacer size="$6" />

            {/* <YStack>
              <Separator />
              <Spacer />
              <XStack space alignItems="center" justifyContent="center">
                <Paragraph size="sm" fontWeight="700">
                  {characters[user.charIndex ?? 0] || '👻'}
                </Paragraph>
                <Paragraph size="sm" opacity={0.5}>
                  {pluralize(votesCount, 'vote')}
                </Paragraph>
                <Middot />
                <Paragraph size="sm" opacity={0.5}>
                  {pluralize(reviewsCount, 'review')}
                </Paragraph>
                <Middot />
                <Paragraph size="sm" opacity={0.5}>
                  {pluralize(favoritesCount, 'favorite')}
                </Paragraph>
              </XStack>
              <Spacer />
              <Separator />
            </YStack> */}

            {/* <Spacer size="$6" /> */}

            <YStack space="$6" paddingVertical={20}>
              {/* PHOTOS FEED */}
              <XStack space>
                {user
                  .reviews({
                    order_by: [{ authored_at: order_by.desc }],
                    where: {
                      photos: {
                        photo_id: {
                          _is_null: false,
                        },
                      },
                    },
                  })
                  .map((review, index) => {
                    return (
                      <YStack
                        key={review.id || index}
                        borderRadius={1000}
                        overflow="hidden"
                        borderWidth={2}
                        borderColor={theme.borderColor}
                      >
                        <Image
                          source={{ uri: review.photos({ limit: 1 })[0]?.photo?.url || '' }}
                          style={{ width: 60, height: 60 }}
                        />
                      </YStack>
                    )
                  })}
              </XStack>

              {/* ABOUT */}
              {!pane && !!user.about && (
                <YStack>
                  <SmallTitle>About</SmallTitle>
                  <Paragraph size="$6">{user.about}</Paragraph>
                </YStack>
              )}

              {/* PLAYLISTS */}
              {!pane && !!lists.length && (
                <YStack position="relative">
                  <AbsoluteYStack zIndex={100} top={-15} left={10}>
                    <SlantedTitle size="$4">Playlists</SlantedTitle>
                  </AbsoluteYStack>
                  <CardCarousel>
                    {lists.map((list, i) => {
                      return (
                        <ListCard
                          colored
                          size="$6"
                          floating
                          key={list.slug || i}
                          list={list}
                          query={lists}
                        />
                      )
                    })}
                  </CardCarousel>
                </YStack>
              )}

              {/* FAVORITE LISTS */}
              {!pane && !!favoriteLists.length && (
                <YStack position="relative">
                  <AbsoluteYStack zIndex={100} top={-15} left={10}>
                    <SlantedTitle size="$4">Liked lists</SlantedTitle>
                  </AbsoluteYStack>
                  <CardCarousel>
                    {favoriteLists.map((list, i) => {
                      return (
                        <ListCard
                          colored
                          floating
                          key={list.slug || i}
                          list={list}
                          query={favoriteLists}
                        />
                      )
                    })}
                  </CardCarousel>
                </YStack>
              )}

              <YStack position="relative" paddingHorizontal={20}>
                <AbsoluteYStack zIndex={100} top={-15} left={10}>
                  <SlantedTitle size="$4">
                    {pane === 'review' ? 'Reviews' : pane === 'vote' ? 'Votes' : 'Recently'}
                  </SlantedTitle>
                </AbsoluteYStack>

                <YStack paddingVertical={25}>
                  {!hasReviews && <Paragraph padding={30}>None yet...</Paragraph>}
                  {hasReviews &&
                    reviews.map((review, i) => (
                      <SuspenseFallback key={`${i}${review.id}`}>
                        <Review review={review} />
                      </SuspenseFallback>
                    ))}
                </YStack>
              </YStack>
            </YStack>
          </PageContentWithFooter>
        </ContentScrollView>
      )
    },
    {
      suspense: false,
    }
  )
)

const ParagraphSkeleton = (props: ParagraphProps) => {
  if (props.children === undefined) {
    return (
      <Paragraph
        {...props}
        color="transparent"
        backgroundColor="$backgroundHover"
        borderRadius={10}
      >
        lorem ipsum
      </Paragraph>
    )
  }
  return <Paragraph {...props} />
}

const UserHeader = memo(
  graphql(
    ({
      item,
    }: StackItemProps<HomeStateItemUser> & {
      setPane: Function
      pane: UserPane | null
    }) => {
      const username = item?.username || ''
      const userStore = useUserStore()
      const user = queryUser(username)
      const isOwnProfile = userStore.user?.username === username
      const date = user.created_at
      const media = useMedia()

      if (!user) {
        return null
      }

      return (
        <YStack position="relative">
          <PaneControlButtonsLeft>
            {isOwnProfile && (
              <Link name="userEdit">
                <SmallButton elevation="$1">Edit profile</SmallButton>
              </Link>
            )}
            <UserSubscribeButton elevation="$1" username={username} />
          </PaneControlButtonsLeft>

          <YStack flex={1} paddingHorizontal={20} paddingTop={55}>
            <XStack alignItems="flex-end" flex={1} position="relative">
              <YStack marginLeft={media.sm ? -60 : -40} marginBottom={-10} marginRight={10}>
                <UserAvatar size={170} avatar={user.avatar ?? ''} charIndex={user.charIndex ?? 0} />
              </YStack>
              <YStack paddingTop={20} flex={1}>
                <H1 paddingRight={30}>{user.name || user.username}</H1>
                <Spacer size="$8" />
                <XStack flexWrap="wrap">
                  <Paragraph opacity={0.5}>{user.username}</Paragraph>

                  {!!user.location && (
                    <>
                      <Spacer />
                      <Middot />
                      <Spacer />
                      <Paragraph opacity={0.5}>{user.location?.trim() || 'earth'}</Paragraph>
                    </>
                  )}

                  {!!date && (
                    <>
                      <Spacer />
                      <Middot />
                      <Spacer />
                      <Paragraph opacity={0.5}>Joined {getTimeFormat(new Date(date))}</Paragraph>
                    </>
                  )}
                </XStack>
                <Spacer size={12} />
              </YStack>
            </XStack>

            <Spacer />

            <Separator />
          </YStack>
        </YStack>
      )
    },
    {
      suspense: false,
    }
  )
)

const UserSubscribeButton = ({ username, ...rest }: SmallButtonProps & { username: string }) => {
  const user = queryUser(username)
  const theme = useTheme()

  return (
    <SmallButton tooltip="Follow user" borderRadius={100} icon={Plus} onPress={() => {}} {...rest}>
      Subscribe
    </SmallButton>
  )
}
