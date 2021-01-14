// // debug
import { series, sleep } from '@dish/async'
import {
  List,
  graphql,
  list,
  listInsert,
  order_by,
  query,
  slugify,
} from '@dish/graph'
import { assertIsString, assertNonNull } from '@dish/helpers'
import { Heart, X } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { Switch } from 'react-native'
import {
  AbsoluteVStack,
  Box,
  Button,
  HStack,
  Input,
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
  blue,
} from '../../../constants/colors'
import { getRestaurantIdentifiers } from '../../../helpers/getRestaurantIdentifiers'
import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { useSetAppMapResults } from '../../AppMapStore'
import { useUserStore, userStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
import { Link } from '../../views/Link'
import { ScalingPressable } from '../../views/ScalingPressable'
import { SlantedTitle } from '../../views/SlantedTitle'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'
import { PageTitle } from '../search/PageTitle'

type Props = StackItemProps<HomeStateItemList>

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
          <StackDrawer closable title={`Create playlist`}>
            <ContentScrollView id="list">
              <ListPageContent {...props} />
            </ContentScrollView>
          </StackDrawer>
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
  const items = list
    .restaurants({
      order_by: [{ position: order_by.desc }],
    })
    .map((r) => {
      return {
        restaurant: r.restaurant,
        comment: r.comment,
        position: r.position,
        dishes: r
          .tags({
            order_by: [{ position: order_by.desc }],
          })
          .map((listTag) => {
            return listTag.restaurant_tag
          }),
      }
    })

  return [
    items,
    () => {
      console.log('todo')
    },
  ] as const
}

const ListPageContent = graphql((props: Props) => {
  const user = useUserStore()
  const isMyList = props.item.userSlug === slugify(user.user?.username)
  const isEditing = props.item.state === 'edit'
  const [color, setColor] = useState(blue)

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

  const l = queryList(props.item.slug)
  const [restaurants, setRestaurants] = useListRestaurants(l)

  function queryList(slug?: string) {
    return query.list({
      where: {
        slug: {
          _eq: slug,
        },
      },
    })[0]
  }

  const list = {
    name: l.name,
    description: l.description,
    user: {
      username: l.user.username,
      name: l.user.name,
    },
    restaurants,
  }

  console.log('list', JSON.stringify(list))

  useSetAppMapResults({
    isActive: props.isActive,
    results: list.restaurants
      .map((x) => x.restaurant)
      .map(getRestaurantIdentifiers),
  })

  return (
    <>
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
                  <Button alignSelf="center" onPress={() => setIsEditing(true)}>
                    Edit
                  </Button>
                )}
                {isEditing && (
                  <HStack alignItems="center">
                    <Theme name="active">
                      <Button>Save</Button>
                    </Theme>
                    <Spacer size="sm" />
                    <VStack onPress={() => setIsEditing(false)}>
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
            <ColorPicker color={color} onChange={setColor} />

            <Spacer size="xl" />

            <Text>Public:&nbsp;&nbsp;</Text>
            <Switch value={true} />
          </HStack>
          <Spacer />
        </>
      )}

      <VStack paddingHorizontal={20} paddingVertical={20}>
        {isEditing ? (
          <Input
            multiline
            numberOfLines={2}
            lineHeight={28}
            fontSize={18}
            marginVertical={-12}
            marginHorizontal={-8}
            textAlign="center"
            defaultValue={list.description}
          />
        ) : (
          <Paragraph size="lg" textAlign="center">
            {list.description}
          </Paragraph>
        )}
      </VStack>

      {list.restaurants.map(({ restaurant, comment, dishes }, index) => {
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
    </>
  )
})

function ColorBubble(props: StackProps) {
  return <VStack borderRadius={1000} width={34} height={34} {...props} />
}

function ColorPicker({
  color,
  onChange,
}: {
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
            {[...allColors, ...allColorsPastel, ...allDarkColor].map(
              (color) => {
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
              }
            )}
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
