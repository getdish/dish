import { series, sleep } from '@dish/async'
import { graphql, order_by, query } from '@dish/graph/src'
import React, { useEffect } from 'react'
import { Paragraph, VStack } from 'snackui'

import { router } from '../../../router'
import { HomeStateItemList } from '../../../types/homeTypes'
import { ContentScrollView } from '../../views/ContentScrollView'
import { StackDrawer } from '../../views/StackDrawer'
import { StackItemProps } from '../HomeStackView'
import { RestaurantListItem } from '../restaurant/RestaurantListItem'

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
  // const list = query
  const restaurants = query.restaurant({
    limit: 10,
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
        {list.restaurants.map((restaurant, index) => {
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
