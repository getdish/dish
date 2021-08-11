import { series } from '@dish/async'
import {
  List,
  graphql,
  list,
  listInsert,
  listUpdate,
  mutate,
  order_by,
  query,
  resolved,
  slugify,
  useRefetch,
} from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { Plus, Trash, X } from '@dish/react-feather'
import React, { Suspense, useEffect, useRef, useState } from 'react'
import { Switch } from 'react-native'
import {
  AbsoluteVStack,
  Box,
  Button,
  HStack,
  Input,
  Modal,
  Paragraph,
  Popover,
  Spacer,
  StackProps,
  Text,
  Toast,
  VStack,
} from 'snackui'

import { bgLight } from '../../../constants/colors'
import { isWeb } from '../../../constants/constants'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { getTimeFormat } from '../../../helpers/getTimeFormat'
import { promote } from '../../../helpers/listHelpers'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMap'
import { homeStore, useHomeStateById } from '../../homeStore'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { BottomFloatingArea } from '../../views/BottomFloatingArea'
import { CloseButton } from '../../views/CloseButton'
import { CommentBubble } from '../../views/CommentBubble'
import { ContentScrollView } from '../../views/ContentScrollView'
import { FavoriteButton } from '../../views/FavoriteButton'
import { Link } from '../../views/Link'
import { useListFavorite } from '../../views/list/useList'
import { PaneControlButtons, PaneControlButtonsLeft } from '../../views/PaneControlButtons'
import { ScalingPressable } from '../../views/ScalingPressable'
import { Score } from '../../views/Score'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { StackItemProps } from '../HomeStackView'
import { PageContentWithFooter } from '../PageContentWithFooter'
import { PageTitle } from '../PageTitle'
import { CircleButton } from '../restaurant/CircleButton'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'
import { useSnapToFullscreenOnMount } from '../restaurant/useSnapToFullscreenOnMount'
import { UserAvatar } from '../user/UserAvatar'
import { ListAddRestuarant } from './ListAddRestuarant'
import { getListColor, listColors, randomListColor } from './listColors'

type Props = StackItemProps<HomeStateItemList>

export default function ListPage(props: Props) {
  const item = useHomeStateById<HomeStateItemList>(props.item.id)
  const isCreating = item.slug === 'create'

  useEffect(() => {
    if (!isCreating) return
    const username = userStore.user?.username
    if (!username) {
      Toast.error(`No user`)
      return
    }
    // create a new list and redirect to it
    return series([
      () => fetch('/api/randomName').then((res) => res.text()),
      async (randomName) => {
        // assertIsString(userStore.user.id, 'expected user id')
        const [list] = await listInsert([
          {
            name: randomName,
            slug: slugify(randomName),
            region: homeStore.lastRegionSlug,
            user_id: userStore.user?.id ?? 'anon',
            color: randomListColor(),
          },
        ])
        return list
      },
      (list) => {
        if (!list) {
          Toast.error(`Error creating list`)
          return
        }
        router.navigate({
          name: 'list',
          replace: true,
          params: {
            userSlug: slugify(username),
            slug: list.slug,
            state: 'edit',
          },
        })
      },
    ])
  }, [isCreating])

  return (
    <>
      {isCreating && (
        <StackDrawer closable title={`Create playlist`}>
          <VStack paddingBottom="50%" alignItems="center" justifyContent="center" flex={1}>
            <Paragraph opacity={0.5}>Creating...</Paragraph>
          </VStack>
        </StackDrawer>
      )}

      {!isCreating && (
        <Suspense fallback={<StackDrawer closable title={`...`} />}>
          <ListPageContent {...props} item={item} />
        </Suspense>
      )}
    </>
  )
}

const setIsEditing = (val: boolean) => {
  router.navigate({
    name: 'list',
    replace: true,
    params: {
      ...router.curPage.params,
      state: val ? 'edit' : undefined,
    },
  })
  if (val === false) {
    router.setRouteAlert(null)
  }
}

function useListRestaurants(list?: list) {
  const refetch = useRefetch()
  const listId = list?.id
  const list_restaurants =
    list?.restaurants({
      limit: 50,
      order_by: [{ position: order_by.asc }],
    }) ?? []

  const items =
    list_restaurants.map((list_restaurant) => {
      const dishQuery = list_restaurant.tags({
        limit: 5,
        order_by: [{ position: order_by.asc }],
      })
      return {
        dishQuery,
        restaurantId: list_restaurant.restaurant.id,
        restaurant: list_restaurant.restaurant,
        comment: list_restaurant.comment,
        position: list_restaurant.position,
        dishSlugs: dishQuery.map((listTag) => listTag.restaurant_tag?.tag.slug || ''),
      }
    }) ?? []

  async function setOrder(ids: string[]) {
    await mutate((mutation) => {
      // seed because it doesnt do it all in one step causing uniqueness violations
      const seed = Math.floor(Math.random() * 10000)
      assertPresent(list, 'no list')
      ids.forEach((rid, position) => {
        mutation.update_list_restaurant_by_pk({
          pk_columns: {
            list_id: listId,
            restaurant_id: rid,
          },
          _set: {
            position: (position + 1) * seed,
          },
        })?.__typename
      })
    })
    await refetch(list)
  }

  return [
    items,
    {
      setOrder,
      add: async (id: string) => {
        await mutate((mutation) => {
          assertPresent(list, 'no list')
          assertPresent(userStore.user, 'no user')
          return mutation.insert_list_restaurant_one({
            object: {
              // negative to go first + space it out
              position: -items.length * Math.round(1000 * Math.random()),
              list_id: listId,
              restaurant_id: id,
              user_id: userStore.user.id,
            },
          })?.__typename
        })
        await Promise.all([refetch(list), refetch(list_restaurants)])
      },
      async promote(index: number) {
        if (index == 0) return
        const now = items.map((x) => x.restaurant.id as string)
        const next = promote(now, index)
        await setOrder(next)
      },
      async delete(id: string) {
        await mutate((mutation) => {
          mutation.delete_list_restaurant({
            where: {
              restaurant_id: {
                _eq: id,
              },
            },
          })?.affected_rows
        })
        await Promise.all([refetch(list), refetch(list_restaurants)])
      },
      async setComment(id: string, comment: string) {
        await mutate((mutation) => {
          return mutation.update_list_restaurant_by_pk({
            pk_columns: {
              list_id: listId,
              restaurant_id: id,
            },
            _set: {
              comment,
            },
          })?.__typename
        })
        await refetch(list)
      },
      async setDishes(id: string, dishTags: string[]) {
        const { dishQuery } = items.find((x) => x.restaurantId === id) ?? {}
        const rtagids = await resolved(() =>
          query.restaurant_tag({ where: { tag: { slug: { _in: dishTags } } } }).map((x) => x.id)
        )
        await mutate((mutation) => {
          // immutable style
          // first delete old ones
          mutation.delete_list_restaurant_tag({
            where: {
              list_restaurant_id: {
                _eq: id,
              },
            },
          })?.__typename
          // then add news ones
          assertPresent(list, 'no list')
          assertPresent(userStore.user, 'no user')
          for (const [position, rid] of rtagids.entries()) {
            mutation.insert_list_restaurant_tag_one({
              object: {
                restaurant_tag_id: rid,
                list_restaurant_id: id,
                list_id: list.id,
                user_id: userStore.user.id,
                position,
              },
            })?.__typename
          }
        })
        await refetch(dishQuery)
      },
    },
  ] as const
}

// in dark mode maybe thats why i had 11 in here?
const lightBackgrounds = new Set([0, 4])

const ListPageContent = graphql((props: Props) => {
  // const themeName = useThemeName()
  // const theme = useTheme()
  const user = useUserStore()
  const isMyList = props.item.userSlug === slugify(user.user?.username)
  const isEditing = props.item.state === 'edit'
  const [showAddModal, setShowAddModal] = useState(false)
  const draft = useRef<Partial<List>>({})
  const refetch = useRefetch()
  const { list, isFavorited, toggleFavorite, reviewsCount } = useListFavorite({
    slug: props.item.slug,
  })
  const [color, setColor] = useStateSynced(getListColor(list?.color) ?? '#999999')
  const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
  const [restaurants, restaurantActions] = useListRestaurants(list)
  const region = useRegionQuery(props.item.region)

  useSnapToFullscreenOnMount()

  useEffect(() => {
    if (!props.isActive) return
    homeStore.updateCurrentState<HomeStateItemList>('ListPage.color', {
      color,
    })
  }, [props.isActive, color])

  useEffect(() => {
    if (isEditing) {
      router.setRouteAlert({
        condition: () => true,
        message: `Cancel editing list and lose edits?`,
      })
      return () => {
        router.setRouteAlert(null)
      }
    }
  }, [isEditing])

  useSetAppMap({
    hideRegions: true,
    isActive: props.isActive,
    results: restaurants.map((x) => x.restaurant).map(getRestaurantIdentifiers),
    showRank: true,
    zoomOnHover: true,
    fitToResults: true,
  })

  if (!list) {
    return (
      <StackDrawer closable title={`404`}>
        <Text>not found 😭</Text>
      </StackDrawer>
    )
  }

  const username = list.user?.name ?? list.user?.username ?? ''

  const tagButtons = list
    .tags({ limit: 10 })
    .map((x) => x.tag!)
    .map((tag, i) => {
      return <TagButton key={tag?.slug ?? i} size="sm" {...getTagButtonProps(tag)} />
    })

  const isLight = typeof list.color === 'number' ? lightBackgrounds.has(list.color) : false

  // <Theme name={themeName === 'dark' ? `green-${themeName}` : 'green'}>
  return (
    <>
      <StackDrawer closable title={`${username}'s ${list.name}`}>
        <PaneControlButtonsLeft>
          <FavoriteButton floating isFavorite={isFavorited} onToggle={toggleFavorite}>
            {reviewsCount}
          </FavoriteButton>
          {!isEditing && isMyList && (
            <SmallButton elevation={1} alignSelf="center" onPress={() => setIsEditing(true)}>
              Edit
            </SmallButton>
          )}
          {isEditing && (
            <>
              <SmallButton
                theme="active"
                elevation={1}
                onPress={async () => {
                  await listUpdate(
                    {
                      id: list.id,
                      ...draft.current,
                      ...(color !== '#999' && {
                        color: listColors.indexOf(color),
                      }),
                      public: isPublic,
                    },
                    {
                      query: list,
                    }
                  )
                  await refetch(list)
                  setIsEditing(false)
                }}
              >
                Save
              </SmallButton>
              <Spacer size="sm" />
              <VStack
                opacity={0.8}
                hoverStyle={{
                  opacity: 1,
                }}
                onPress={() => {
                  setIsEditing(false)
                }}
              >
                <X color={isWeb ? 'var(--color)' : '#777'} size={20} />
              </VStack>
              <Spacer size="lg" />
            </>
          )}
        </PaneControlButtonsLeft>

        {props.isActive && isMyList && (
          <BottomFloatingArea>
            <Button
              pointerEvents="auto"
              theme="active"
              borderRadius={100}
              width={50}
              height={50}
              alignItems="center"
              justifyContent="center"
              elevation={2}
              noTextWrap
              onPress={() => {
                setShowAddModal(true)
              }}
            >
              <Plus size={32} color="#fff" />
            </Button>
            <VStack pointerEvents="none" flex={1} />
          </BottomFloatingArea>
        )}

        {isMyList && (
          <Modal
            visible={showAddModal}
            onDismiss={() => setShowAddModal(false)}
            width={380}
            maxHeight={480}
            minHeight={480}
          >
            {showAddModal && (
              <>
                <PaneControlButtons>
                  <CloseButton onPress={() => setShowAddModal(false)} />
                </PaneControlButtons>
                <Suspense fallback={null}>
                  <ListAddRestuarant
                    listSlug={props.item.slug}
                    onAdd={({ id }) => {
                      restaurantActions.add(id)
                    }}
                  />
                </Suspense>
              </>
            )}
          </Modal>
        )}

        <ContentScrollView id="list">
          <PageContentWithFooter>
            {/* overflow clip prevention with marginVerticals here */}
            <VStack position="relative" marginHorizontal={-20}>
              {/* <AbsoluteVStack
                zIndex={-1}
                fullscreen
                rotateY="-12deg"
                backgroundColor={theme.backgroundColorTransluscent}
              /> */}
              <ListPageTitle
                isLight={isLight}
                locationName={region.data?.name ?? props.item.region}
                list={list}
                isEditing={isEditing}
                draft={draft}
              />
            </VStack>

            {isMyList && (
              <>
                <HStack alignItems="center" justifyContent="center">
                  {isEditing && (
                    <>
                      <Paragraph>Color&nbsp;&nbsp;</Paragraph>
                      <ColorPicker colors={listColors} color={color} onChange={setColor} />

                      <Spacer size="xl" />

                      <Paragraph>Public&nbsp;&nbsp;</Paragraph>
                      <Switch value={isPublic} onValueChange={setPublic} />

                      <Spacer size="xl" />

                      <SmallButton
                        tooltip="Delete"
                        icon={<Trash size={16} />}
                        onPress={async () => {
                          assertPresent(list.id, 'no list id')
                          if (confirm('Permanently delete this list?')) {
                            await mutate((mutation) => {
                              return mutation.delete_list({
                                where: {
                                  id: {
                                    _eq: list.id,
                                  },
                                },
                              })?.__typename
                            })
                            Toast.show('Deleted list')
                            router.navigate({
                              name: 'home',
                            })
                          }
                        }}
                      />
                    </>
                  )}
                </HStack>
                <Spacer />
              </>
            )}

            {!!(list.description || isEditing) && (
              <CommentBubble
                after={
                  <HStack paddingHorizontal={20} borderRadius={20} alignItems="center">
                    <HStack alignItems="center">
                      <UserAvatar
                        size={24}
                        charIndex={list?.user?.charIndex}
                        avatar={list?.user?.avatar}
                      />
                      <Spacer size="sm" />
                      <Paragraph opacity={0.5} size="sm">
                        by {list.user?.username}
                      </Paragraph>
                      <Spacer />
                      <Paragraph opacity={0.5} size="sm">
                        &middot;
                      </Paragraph>
                      <Spacer />
                      <Paragraph opacity={0.5} size="sm">
                        {list.created_at ? getTimeFormat(new Date(list.created_at)) : ''}
                      </Paragraph>
                    </HStack>

                    {!!tagButtons.length && (
                      <>
                        <Spacer />
                        <Paragraph opacity={0.5} size="sm">
                          &middot;
                        </Paragraph>
                        <Spacer />
                        <HStack spacing justifyContent="center">
                          {tagButtons}
                        </HStack>
                      </>
                    )}
                    <Paragraph opacity={0.5} size="sm">
                      &middot;
                    </Paragraph>
                    <Spacer />
                  </HStack>
                }
                avatar={list.user?.avatar}
                name={list.user?.username ?? ''}
              >
                {isEditing ? (
                  <Input
                    placeholder="Description..."
                    multiline
                    numberOfLines={1}
                    lineHeight={30}
                    width="100%"
                    fontSize={20}
                    marginVertical={-12}
                    marginHorizontal={-8}
                    defaultValue={list.description ?? ''}
                    onChangeText={(val) => {
                      draft.current.description = val
                    }}
                  />
                ) : (
                  <Paragraph size="lg">{list.description}</Paragraph>
                )}
              </CommentBubble>
            )}

            <VStack minHeight={300}>
              {!restaurants.length && (
                <VStack
                  padding={20}
                  margin={20}
                  borderWidth={1}
                  borderColor="rgba(100,100,100,0.1)"
                  borderRadius={10}
                >
                  <Paragraph fontWeight="800">Nothing added to this list, yet.</Paragraph>
                  {isMyList && (
                    <Paragraph>
                      Use the blue (+) button at the bottom. You can also add from any search page
                      results.
                    </Paragraph>
                  )}
                </VStack>
              )}

              {restaurants.map(
                ({ restaurantId, restaurant, comment, dishSlugs, position }, index) => {
                  if (!restaurant.slug) {
                    return null
                  }
                  return (
                    <React.Fragment key={restaurant.slug}>
                      <RestaurantListItem
                        curLocInfo={props.item.curLocInfo ?? null}
                        restaurantId={restaurantId}
                        restaurantSlug={restaurant.slug}
                        rank={index + 1}
                        description={comment}
                        hideTagRow
                        above={
                          isEditing && (
                            <>
                              <AbsoluteVStack top={-28} left={28}>
                                <CircleButton
                                  backgroundColor={bgLight}
                                  width={44}
                                  height={44}
                                  onPress={() => {
                                    restaurantActions.delete(restaurantId)
                                  }}
                                >
                                  <X size={20} />
                                </CircleButton>
                              </AbsoluteVStack>
                              <Score
                                votable
                                upTooltip="Move up"
                                downTooltip="Move down"
                                score={index + 1}
                                setVote={async (vote) => {
                                  restaurantActions.promote(vote === 1 ? index : index + 1)
                                }}
                              />
                            </>
                          )
                        }
                        flexibleHeight
                        dishSlugs={dishSlugs.length ? dishSlugs : undefined}
                        editableDishes={isEditing}
                        onChangeDishes={async (dishes) => {
                          console.log('should change dishes', dishes)
                          await restaurantActions.setDishes(restaurantId, dishes)
                          Toast.success(`Updated dishes`)
                        }}
                        editableDescription={isEditing}
                        onChangeDescription={async (next) => {
                          await restaurantActions.setComment(restaurantId, next)
                          Toast.success('Updated description')
                        }}
                        editablePosition={isEditing}
                        onChangePosition={(next) => {
                          console.log('should change position', next)
                        }}
                      />
                      <Spacer />
                    </React.Fragment>
                  )
                }
              )}
            </VStack>
          </PageContentWithFooter>
        </ContentScrollView>
      </StackDrawer>
    </>
  )
})

const ListPageTitle = ({
  isLight,
  list,
  locationName,
  isEditing,
  draft,
}: {
  isLight: boolean
  locationName: string
  list: list
  isEditing?: boolean
  draft: any
}) => {
  const len = list.name?.length ?? 16
  const color = getListColor(list.color)
  const textColor = isLight ? '#000' : '#fff'

  return (
    <PageTitle
      noDivider
      title={
        <>
          <VStack
            marginHorizontal="auto"
            marginTop={15}
            alignItems="center"
            justifyContent="center"
          >
            <ScalingPressable>
              <Link name="user" params={{ username: list.user?.username ?? '' }}>
                <SlantedTitle scale={1} size="md" alignSelf="center">
                  {list.user?.username ?? '...'}'s
                </SlantedTitle>
              </Link>
            </ScalingPressable>

            <VStack position="relative" alignSelf="center">
              <SlantedTitle
                marginTop={-5}
                backgroundColor={color}
                alignSelf="center"
                zIndex={0}
                size={
                  len < 12 ? 'xxxl' : len < 16 ? 'xxl' : len < 24 ? 'xl' : len < 30 ? 'lg' : 'md'
                }
                color={textColor}
              >
                {isEditing ? (
                  <Input
                    fontSize={20}
                    backgroundColor="transparent"
                    defaultValue={list.name || ''}
                    onChangeText={(val) => {
                      draft.current.name = val
                    }}
                    fontWeight="700"
                    textAlign="center"
                    color={textColor}
                    borderColor="transparent"
                    margin={-5}
                  />
                ) : (
                  list.name
                )}
              </SlantedTitle>
              <SlantedTitle fontWeight="300" scale={1} zIndex={-1} size="xxs" alignSelf="center">
                {locationName ?? 'anywhere'}
              </SlantedTitle>
            </VStack>
          </VStack>
        </>
      }
    />
  )
}

function ColorBubble(props: StackProps) {
  return (
    <VStack
      borderWidth={2}
      borderColor="#000"
      borderRadius={1000}
      width={34}
      height={34}
      {...props}
    />
  )
}

function ColorPicker({
  colors,
  color,
  onChange,
}: {
  colors: string[]
  color: string
  onChange: (next: string) => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Popover
      isOpen={isOpen}
      onChangeOpen={setIsOpen}
      contents={() => {
        return (
          <Box
            flexDirection="row"
            padding={20}
            maxWidth={130}
            flexWrap="wrap"
            justifyContent="space-between"
          >
            {colors.map((color) => {
              return (
                <ColorBubble
                  key={color}
                  marginBottom={10}
                  backgroundColor={color}
                  onPress={() => {
                    onChange(color)
                    setIsOpen(false)
                  }}
                />
              )
            })}
          </Box>
        )
      }}
    >
      <VStack onPress={() => setIsOpen((x) => !x)}>
        <ColorBubble backgroundColor={color} />
      </VStack>
    </Popover>
  )
}
