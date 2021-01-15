// // debug
import { series, sleep } from '@dish/async'
import {
  List,
  graphql,
  list,
  listInsert,
  listUpdate,
  mutate,
  mutation,
  order_by,
  resolved,
  slugify,
  useRefetch,
} from '@dish/graph'
import { assertIsString } from '@dish/helpers'
import { Heart, Plus, X } from '@dish/react-feather'
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
} from 'snackui'

import {
  allColors,
  allColorsPastel,
  allDarkColor,
} from '../../../constants/colors'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { queryList } from '../../../queries/queryList'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMapResults } from '../../AppMapStore'
import { useStateSynced } from '../../hooks/useStateSynced'
import { useUserStore, userStore } from '../../userStore'
import { CloseButton } from '../../views/CloseButton'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { PaneControlButtons } from '../../views/PaneControlButtons'
import { ScalingPressable } from '../../views/ScalingPressable'
import { SlantedTitle } from '../../views/SlantedTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { UpvoteDownvoteScore } from '../../views/UpvoteDownvoteScore'
import { StackItemProps } from '../HomeStackView'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'
import { PageTitle } from '../search/PageTitle'
import { BottomFloatingArea } from './BottomFloatingArea'
import { ListAddRestuarant } from './ListAddRestuarant'

type Props = StackItemProps<HomeStateItemList>

const listColors = [...allColors, ...allColorsPastel, ...allDarkColor]

export default function ListPage(props: Props) {
  const isCreating = props.item.slug === 'create'

  useEffect(() => {
    if (!isCreating) return
    // create a new list and redirect to it
    return series([
      () => sleep(500),
      () => fetch('/api/randomName').then((res) => res.text()),
      async (randomName) => {
        assertIsString(userStore.user.id, 'no-user-id')
        const [list] = await listInsert([
          {
            name: randomName,
            slug: slugify(randomName),
            user_id: userStore.user.id,
          },
        ])
        console.log('list', list)
        return list
      },
      (list) => {
        if (!list) {
          Toast.error(`Error creating list`)
          return
        }
        router.navigate({
          name: 'list',
          params: {
            userSlug: props.item.userSlug,
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

function useListRestaurants(list: list) {
  const refetch = useRefetch()
  list.id
  const itemsQuery = list?.restaurants({
    limit: 50,
    order_by: [{ position: order_by.asc }],
  })
  const items =
    itemsQuery.map((r) => {
      r.restaurant.id
      return {
        restaurant: r.restaurant,
        comment: r.comment,
        position: r.position,
        dishes: r
          .tags({
            limit: 5,
            order_by: [{ position: order_by.asc }],
          })
          .map((listTag) => {
            return listTag.restaurant_tag
          }),
      }
    }) ?? []
  return [
    items,
    {
      add: async (id: string) => {
        await resolved(() => {
          return mutation.insert_list_restaurant_one({
            object: {
              // negative to go first + space it out
              position: -items.length * 100,
              list_id: list.id,
              restaurant_id: id,
            },
          }).__typename
        })
        refetch(itemsQuery)
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

  const refetch = useRefetch()
  const [list] = queryList(props.item.slug)
  const [color, setColor] = useStateSynced(listColors[list?.color] ?? '#999')
  const [isPublic, setPublic] = useStateSynced(list?.public ?? true)
  const [restaurants, restaurantActions] = useListRestaurants(list)

  useSetAppMapResults({
    isActive: props.isActive,
    results: restaurants.map((x) => x.restaurant).map(getRestaurantIdentifiers),
  })

  if (!list) {
    return (
      <StackDrawer closable title={`404`}>
        <Text>not found 😭</Text>
      </StackDrawer>
    )
  }

  return (
    <StackDrawer closable title={`${list.user.name}'s ${list.name}`}>
      {isMyList && (
        <BottomFloatingArea>
          <VStack flex={1} />
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
            shadowOpacity={0.2}
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

        <PageTitle
          before={
            <HStack
              position="absolute"
              zIndex={10}
              top={-10}
              left={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              backgroundColor="#fff"
              padding={20}
            >
              {isMyList && (
                <>
                  {!isEditing && (
                    <Button
                      alignSelf="center"
                      onPress={() => setIsEditing(true)}
                    >
                      Edit
                    </Button>
                  )}
                  {isEditing && (
                    <HStack alignItems="center">
                      <Theme name="active">
                        <Button
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
                        </Button>
                      </Theme>
                      <Spacer size="sm" />
                      <VStack
                        onPress={() => {
                          if (confirm('Lose any changes?')) {
                            setIsEditing(false)
                          }
                        }}
                      >
                        <X size={20} />
                      </VStack>
                    </HStack>
                  )}
                </>
              )}
            </HStack>
          }
          title={
            <VStack>
              <ScalingPressable>
                <Link name="user" params={{ username: list.user.username }}>
                  <SlantedTitle size="xs" alignSelf="center">
                    {list.user.name}'s
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
            </VStack>
          }
          after={
            <AbsoluteVStack
              top={-10}
              right={0}
              bottom={0}
              alignItems="center"
              justifyContent="center"
              backgroundColor="#fff"
              padding={20}
            >
              <Heart size={30} />
            </AbsoluteVStack>
          }
        />

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
            </HStack>
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
              defaultValue={list.description}
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

        {restaurants.map(({ restaurant, comment, dishes, position }, index) => {
          const dishSlugs = dishes.map((x) => x.tag.slug)
          if (!restaurant.slug) {
            return null
          }
          return (
            <RestaurantListItem
              key={restaurant.slug}
              curLocInfo={props.item.curLocInfo ?? null}
              restaurantId={restaurant.id}
              restaurantSlug={restaurant.slug}
              rank={index + 1}
              description={comment}
              hideTagRow
              above={
                <UpvoteDownvoteScore
                  score={index + 1}
                  setVote={async (vote) => {
                    // immutable style because its tricky
                    const moveUpIndex = index - vote
                    // get next ordering
                    const next = []
                    for (const [ri, { restaurant }] of restaurants.entries()) {
                      if (ri === moveUpIndex) {
                        next.unshift(restaurant.id)
                      } else {
                        next.push(restaurant.id)
                      }
                    }
                    // seems like hasura isnt merging it into one big mutation
                    const seed = Math.round(Math.random() * 1000)
                    await mutate((mutation) => {
                      const mutations = []
                      for (const [position, rid] of next.entries()) {
                        mutations.push(
                          mutation.update_list_restaurant_by_pk({
                            pk_columns: {
                              list_id: list.id,
                              restaurant_id: rid,
                            },
                            _set: {
                              position: (position + 1) * seed,
                            },
                          }).__typename
                        )
                      }
                      return mutations
                    })
                    refetch(list)
                  }}
                />
              }
              flexibleHeight
              dishSlugs={dishSlugs}
              editableDishes={isEditing}
              onChangeDishes={(dishes) => {
                console.log('should change dishes', dishes)
              }}
              editableDescription={isEditing}
              onChangeDescription={(next) => {
                console.log('should change descirption', next)
              }}
              editablePosition={isEditing}
              onChangePosition={(next) => {
                console.log('should change position', next)
              }}
            />
          )
        })}
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

// const list = {
//   name: 'Horse Fish Circus',
//   slug: 'horse-fish-circus',
//   user: {
//     name: 'Peach',
//     username: 'admin',
//   },
//   description:
//     'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
//   restaurants: restaurants.map((restaurant, index) => {
//     return {
//       restaurant,
//       description:
//         'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
//       position: index,
//       dishes: restaurant
//         .tags({
//           where: {
//             tag: {
//               type: {
//                 _eq: 'dish',
//               },
//             },
//           },
//           limit: 8,
//           order_by: [
//             {
//               upvotes: order_by.desc,
//             },
//           ],
//         })
//         .map((x) => x.tag),
//     }
//   }),
// }
