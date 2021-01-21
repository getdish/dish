// debug
import { series, sleep } from '@dish/async'
import { slugify } from '@dish/graph/src'
import { graphql, order_by, query } from '@dish/graph/src'
import { Heart, X } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native'
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
  Theme,
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
import { useUserStore } from '../../userStore'
import { ContentScrollView } from '../../views/ContentScrollView'
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
      () => sleep(1000),
      () => {
        router.navigate({
          name: 'list',
          params: {
            userSlug: props.item.userSlug,
            slug: 'horse-fish-circus',
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

const ListPageContent = graphql((props: Props) => {
  const user = useUserStore()
  const isMyList = props.item.userSlug === slugify(user.user?.username)
  const [isEditing, setIsEditing] = useState(false)
  const [color, setColor] = useState(blue)

  // fake data until i get docker/schema generation workign
  const restaurants = query.restaurant({
    limit: 10,
    where: {
      summary: {
        _is_null: false,
      },
    },
    order_by: [
      {
        upvotes: order_by.desc,
      },
    ],
  })
  const list = {
    name: 'Horse Fish Circus',
    slug: 'horse-fish-circus',
    user: {
      name: 'Peach',
    },
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
    restaurants: restaurants.map((restaurant, index) => {
      return {
        restaurant,
        description:
          'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
        position: index,
        dishes: restaurant
          .tags({
            where: {
              tag: {
                type: {
                  _eq: 'dish',
                },
              },
            },
            limit: 8,
            order_by: [
              {
                upvotes: order_by.desc,
              },
            ],
          })
          .map((x) => x.tag),
      }
    }),
  }

  useSetAppMapResults({
    isActive: props.isActive,
    results: list.restaurants.map((r) =>
      getRestaurantIdentifiers(r.restaurant)
    ),
  })

  return (
    <StackDrawer closable title={`Create playlist`}>
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
                        <Button>Save</Button>
                      </Theme>
                      <Spacer />
                      <ColorPicker color={color} onChange={setColor} />
                      <Spacer />
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
              <SlantedTitle size="xs" alignSelf="center">
                {list.user.name}'s
              </SlantedTitle>

              <SlantedTitle
                backgroundColor={color}
                color="#fff"
                marginTop={-5}
                alignSelf="center"
              >
                {list.name}
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

        <VStack paddingHorizontal={20} paddingVertical={20}>
          {isEditing ? (
            <Input
              multiline
              numberOfLines={2}
              lineHeight={24}
              textAlign="center"
              defaultValue={list.description}
            />
          ) : (
            <Paragraph size="lg" textAlign="center">
              {list.description}
            </Paragraph>
          )}
        </VStack>

        {list.restaurants.map(({ restaurant, description, dishes }, index) => {
          if (!restaurant.slug) {
            return null
          }
          return (
            <RestaurantListItem
              curLocInfo={props.item.curLocInfo ?? null}
              restaurantId={restaurant.id}
              restaurantSlug={restaurant.slug}
              rank={index + 1}
              description={description}
              hideTagRow
              dishSlugs={dishes.map((x) => x.slug)}
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
