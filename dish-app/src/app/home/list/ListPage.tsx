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
import { assertPresent, isPresent } from '@dish/helpers'
import { Heart, Plus, Trash, X } from '@dish/react-feather'
import React, { useEffect, useRef, useState } from 'react'
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
  Theme,
  Toast,
  VStack,
  useTheme,
} from 'snackui'

import { bgLight } from '../../../constants/colors'
import { useRegionQuery } from '../../../helpers/fetchRegion'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { queryList } from '../../../queries/queryList'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMap } from '../../AppMapStore'
import { homeStore } from '../../homeStore'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { BottomFloatingArea } from '../../views/BottomFloatingArea'
import { CloseButton } from '../../views/CloseButton'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { ScalingPressable } from '../../views/ScalingPressable'
import { SlantedTitle } from '../../views/SlantedTitle'
import { SmallButton } from '../../views/SmallButton'
import { StackDrawer } from '../../views/StackDrawer'
import { TagButton, getTagButtonProps } from '../../views/TagButton'
import { TagSmallButton } from '../../views/TagSmallButton'
import { UpvoteDownvoteScore } from '../../views/UpvoteDownvoteScore'
import { StackItemProps } from '../HomeStackView'
import { PageFooter } from '../PageFooter'
import { CircleButton } from '../restaurant/CircleButton'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'
import { PageTitle } from '../search/PageTitle'
import { ListAddRestuarant } from './ListAddRestuarant'
import { getListColor, listColors } from './listColors'

type Props = StackItemProps<HomeStateItemList>

export default function ListPage(props: Props) {
  const isCreating = props.item.slug.startsWith('create')

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
            region: list.region,
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
          <VStack
            paddingBottom="50%"
            alignItems="center"
            justifyContent="center"
            flex={1}
          >
            <Paragraph opacity={0.5}>Creating...</Paragraph>
          </VStack>
        </StackDrawer>
      )}

      {!isCreating && (
        <>
          <ListPageContent {...props} />
        </>
      )}
    </>
  )
}

const setIsEditing = (val: boolean) => {
  router.navigate({
    name: 'list',
    params: {
      ...router.curPage.params,
      state: val ? 'edit' : undefined,
    },
  })
}

function useListRestaurants(list?: list) {
  const refetch = useRefetch()
  list?.id
  const itemsQuery =
    list?.restaurants({
      limit: 50,
      order_by: [{ position: order_by.asc }],
    }) ?? []

  const items =
    itemsQuery.map((r) => {
      const dishQuery = r.tags({
        limit: 5,
        order_by: [{ position: order_by.asc }],
      })
      return {
        dishQuery,
        restaurantId: r.restaurant.id,
        restaurant: r.restaurant,
        comment: r.comment,
        position: r.position,
        dishes: dishQuery.map((listTag) => listTag.restaurant_tag),
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
            list_id: list.id,
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
              list_id: list.id,
              restaurant_id: id,
              user_id: userStore.user.id,
            },
          })?.__typename
        })
        await Promise.all([refetch(list), refetch(itemsQuery)])
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
        await Promise.all([refetch(list), refetch(itemsQuery)])
      },
      async setDishes(id: string, dishTags: string[]) {
        const { dishQuery } = items.find((x) => x.restaurantId === id) ?? {}
        const rtagids = await resolved(() =>
          query
            .restaurant_tag({ where: { tag: { slug: { _in: dishTags } } } })
            .map((x) => x.id)
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
        refetch(dishQuery)
      },
    },
  ] as const
}

const ListPageContent = graphql((props: Props) => {
  const user = useUserStore()
  const isMyList = props.item.userSlug === slugify(user.user?.username)
  const isEditing = props.item.state === 'edit'
  const [showAddModal, setShowAddModal] = useState(false)
  const draft = useRef<Partial<List>>({})
  const theme = useTheme()
  const refetch = useRefetch()
  const [list] = queryList(props.item.slug)
  const [color, setColor] = useStateSynced(getListColor(list?.color) ?? '#999')
  const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
  const [restaurants, restaurantActions] = useListRestaurants(list)
  const region = useRegionQuery(props.item.region)

  useEffect(() => {
    if (isEditing) {
      return router.setRouteAlert({
        condition: () => true,
        message: `Cancel editing list and lose edits?`,
      })
    }
  }, [isEditing])

  useSetAppMap({
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
    .map((tag) => {
      return <TagButton key={tag?.slug} size="sm" {...getTagButtonProps(tag)} />
    })

  return (
    <StackDrawer closable title={`${username}'s ${list.name}`}>
      {isMyList && (
        <BottomFloatingArea>
          <VStack pointerEvents="none" flex={1} />
          <Button
            pointerEvents="auto"
            theme="active"
            borderRadius={100}
            width={50}
            height={50}
            alignItems="center"
            justifyContent="center"
            shadowColor="#000"
            shadowRadius={20}
            shadowOffset={{ height: 4, width: 0 }}
            shadowOpacity={0.35}
            noTextWrap
            onPress={() => {
              setShowAddModal(true)
            }}
          >
            <Plus size={32} color="#fff" />
          </Button>
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
          <PaneControlButtons>
            <CloseButton onPress={() => setShowAddModal(false)} />
          </PaneControlButtons>
          <ListAddRestuarant
            listSlug={props.item.slug}
            onAdd={({ id }) => {
              restaurantActions.add(id)
            }}
          />
        </Modal>
      )}

      <ContentScrollView id="list">
        <Spacer />

        <HStack position="absolute" zIndex={10} top={-10} left={0} padding={20}>
          {isMyList && (
            <>
              {!isEditing && (
                <Button alignSelf="center" onPress={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
              {isEditing && (
                <HStack alignItems="center">
                  <Button
                    theme="active"
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
                      router.setRouteAlert(null)
                      setIsEditing(false)
                    }}
                  >
                    Save
                  </Button>
                  <Spacer size="sm" />
                  <VStack
                    onPress={() => {
                      setIsEditing(false)
                    }}
                  >
                    <X size={20} />
                  </VStack>
                </HStack>
              )}
            </>
          )}
        </HStack>

        {/* overflow clip prevention with marginVerticals here */}
        <VStack marginVertical={-15}>
          <PageTitle
            noDivider
            title={
              <VStack marginVertical={15}>
                <ScalingPressable>
                  <Link
                    name="user"
                    params={{ username: list.user?.username ?? '' }}
                  >
                    <SlantedTitle size="xs" alignSelf="center">
                      {username}'s
                    </SlantedTitle>
                  </Link>
                </ScalingPressable>

                <SlantedTitle
                  backgroundColor={color}
                  color="#fff"
                  marginTop={-5}
                  alignSelf="center"
                  zIndex={0}
                >
                  {isEditing ? (
                    <Input
                      fontSize={26}
                      backgroundColor="transparent"
                      defaultValue={list.name}
                      onChangeText={(val) => {
                        draft.current.name = val
                      }}
                      fontWeight="700"
                      textAlign="center"
                      color="#fff"
                      borderColor="transparent"
                      margin={-5}
                    />
                  ) : (
                    list.name
                  )}
                </SlantedTitle>

                <SlantedTitle size="xs" alignSelf="center">
                  {region.data?.name ?? props.item.region}
                </SlantedTitle>
              </VStack>
            }
            after={
              <AbsoluteVStack
                top={-10}
                right={0}
                bottom={0}
                alignItems="center"
                justifyContent="center"
                backgroundColor={theme.backgroundColor}
                padding={20}
              >
                <Heart size={30} />
              </AbsoluteVStack>
            }
          />
        </VStack>

        {isEditing && (
          <>
            <Spacer />
            <HStack alignItems="center" justifyContent="center">
              <Text>Color:&nbsp;&nbsp;</Text>
              <ColorPicker
                colors={listColors}
                color={color}
                onChange={setColor}
              />

              <Spacer size="xl" />

              <Text>Public:&nbsp;&nbsp;</Text>
              <Switch value={isPublic} onValueChange={setPublic} />

              <Spacer size="xl" />

              <SmallButton
                tooltip="Delete"
                icon={<Trash size={16} color="red" />}
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
            </HStack>
            <Spacer />
          </>
        )}

        {!!tagButtons && (
          <>
            <HStack justifyContent="center">{tagButtons}</HStack>
            <Spacer />
          </>
        )}

        <VStack paddingHorizontal={20} paddingVertical={20}>
          {isEditing ? (
            <Input
              placeholder="Description..."
              multiline
              numberOfLines={2}
              lineHeight={28}
              fontSize={18}
              marginVertical={-12}
              marginHorizontal={-8}
              textAlign="center"
              defaultValue={list.description ?? ''}
              onChangeText={(val) => {
                draft.current.description = val
              }}
            />
          ) : (
            <Paragraph size="lg" textAlign="center">
              {list.description}
            </Paragraph>
          )}
        </VStack>

        <VStack minHeight={300}>
          {!restaurants.length && (
            <VStack
              padding={20}
              margin={20}
              borderWidth={1}
              borderColor="rgba(100,100,100,0.1)"
              borderRadius={10}
            >
              <Paragraph fontWeight="800">
                Nothing added to this list, yet.
              </Paragraph>
              {isMyList && (
                <Paragraph>
                  Use the blue (+) button on the bottom right to add.
                </Paragraph>
              )}
            </VStack>
          )}

          {restaurants.map(
            (
              { restaurantId, restaurant, comment, dishes, position },
              index
            ) => {
              const dishSlugs = dishes.map((x) => x?.tag.slug).filter(isPresent)
              if (!restaurant.slug) {
                return null
              }
              return (
                <RestaurantListItem
                  key={restaurant.slug}
                  curLocInfo={props.item.curLocInfo ?? null}
                  restaurantId={restaurantId}
                  restaurantSlug={restaurant.slug}
                  rank={index + 1}
                  description={comment}
                  hideTagRow
                  above={
                    <>
                      {isEditing && (
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
                      )}
                      <UpvoteDownvoteScore
                        upTooltip="Move up"
                        downTooltip="Move down"
                        score={index + 1}
                        setVote={async (vote) => {
                          restaurantActions.promote(
                            vote === 1 ? index : index + 1
                          )
                        }}
                      />
                    </>
                  }
                  flexibleHeight
                  dishSlugs={dishSlugs.length ? dishSlugs : undefined}
                  editableDishes={isEditing}
                  onChangeDishes={async (dishes) => {
                    console.log('should change dishes', dishes)
                    restaurantActions.setDishes(restaurantId, dishes)
                  }}
                  editableDescription={isMyList}
                  onChangeDescription={(next) => {
                    console.log('should change descirption', next)
                  }}
                  editablePosition={isEditing}
                  onChangePosition={(next) => {
                    console.log('should change position', next)
                  }}
                />
              )
            }
          )}
        </VStack>

        <Spacer size="xxxl" />

        <PageFooter />
      </ContentScrollView>
    </StackDrawer>
  )
})

function ColorBubble(props: StackProps) {
  return <VStack borderRadius={1000} width={34} height={34} {...props} />
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

function promote(items: any[], index: number): any[] {
  const now = [...items]
  const [id] = now.splice(index, 1)
  if (!id) return []
  now.splice(index - 1, 0, id)
  return now
}
