// debug
import { series, sleep } from '@dish/async'
import { slugify } from '@dish/graph/src'
import { graphql, order_by, query } from '@dish/graph/src'
import { Heart, X } from '@dish/react-feather'
import React, { useEffect, useState } from 'react'
import {
  AbsoluteVStack,
  Button,
  HStack,
  Paragraph,
  Spacer,
  Theme,
  VStack,
} from 'snackui'

import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
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

  // const list = query
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
  // fake list until i get docker/schema generation workign
  const list = {
    name: 'Horse Fish Circus',
    slug: 'horse-fish-circus',
    user: {
      name: 'Peach',
    },
    description:
      'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
    restaurants,
    comments: restaurants.map((r) => {
      return {
        restaurant_id: r.id,
        text:
          'Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet.',
      }
    }),
  }

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

              <SlantedTitle marginTop={-5} alignSelf="center">
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
          <Paragraph size="lg" textAlign="center">
            {list.description}
          </Paragraph>
        </VStack>

        {list.restaurants.map((restaurant, index) => {
          restaurant.slug
          restaurant.id
          if (!restaurant.slug) {
            return null
          }
          return (
            <RestaurantListItem
              curLocInfo={props.item.curLocInfo ?? null}
              restaurantId={restaurant.id}
              restaurantSlug={restaurant.slug}
              rank={index + 1}
            />
          )
        })}
      </ContentScrollView>
    </StackDrawer>
  )
})
