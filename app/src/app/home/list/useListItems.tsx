import { sleep } from '@dish/async'
import {
  list,
  list_restaurant_constraint,
  list_restaurant_update_column,
  mutate,
  order_by,
  useRefetch,
} from '@dish/graph'
import { assertPresent, isPresent } from '@dish/helpers'
import { useEffect, useState } from 'react'
import { DragEndParams } from 'react-native-draggable-flatlist'
import { Toast, useDebounce, useLazyEffect } from 'snackui'

import { promote } from '../../../helpers/listHelpers'
import { userStore } from '../../userStore'

export function useListItems(list?: list) {
  const refetch = useRefetch()
  const listId = list?.id
  const list_restaurants =
    list?.restaurants({
      limit: 50,
      order_by: [{ position: order_by.asc }],
    }) ?? []

  const items =
    list_restaurants.map((list_restaurant, index) => {
      // const dishQuery = list_restaurant.tags({
      //   limit: 5,
      //   order_by: [{ position: order_by.asc }],
      // })
      return {
        // dishQuery,
        list_restaurant,
        key: list_restaurant.id || index,
        id: list_restaurant.id,
        restaurantId: list_restaurant.restaurant.id,
        restaurant: list_restaurant.restaurant,
        comment: list_restaurant.comment,
        position: list_restaurant.position,
        // dishSlugs: dishQuery.map((listTag) => listTag.restaurant_tag?.tag.slug || ''),
      }
    }) ?? []

  const orderNow = items.map((x) => x.restaurantId)
  const [orderOverride, setOrderOverride] = useState<string[]>()

  useLazyEffect(() => {
    setOrderOverride(orderNow)
  }, [orderNow.join('')])

  const mutateOrder = useDebounce(
    async (ids: string[]) => {
      await mutate((mutation) => {
        // seed because it doesnt do it all in one step causing uniqueness violations
        const seed = Math.floor(Math.random() * 10000)
        assertPresent(list, 'no list')
        const positions = ids.map((_, position) => (position + 1) * seed)
        for (const [index, id] of ids.entries()) {
          const position = positions[index]
          console.log('set', ids, id, position, listId)
          mutation.update_list_restaurant_by_pk({
            pk_columns: {
              list_id: listId,
              restaurant_id: id,
            },
            _set: {
              position,
            },
          })?.__typename
        }
      })
      // await sleep(16)
      // await Promise.all([refetch(list), refetch(list_restaurants)])
    },
    16,
    {},
    [listId]
  )

  const setOrder = async (ids: string[]) => {
    setOrderOverride(ids)
    await mutateOrder(ids)
  }

  const itemsFinal = (orderOverride || orderNow)
    .map((id) => items.find((x) => x.restaurantId === id))
    .filter(isPresent)

  // console.log('itemsFinal', itemsFinal, orderOverride, orderNow, items)

  return {
    items: itemsFinal,
    setOrder,
    async add(restaurantId: string) {
      await mutate((mutation) => {
        assertPresent(list, 'no list')
        assertPresent(userStore.user, 'no user')
        const listRestaurant = items.find((x) => x.restaurantId === restaurantId)
        return mutation.insert_list_restaurant_one({
          object: {
            // space it out (insert at bottom)
            position: items.length * 1000,
            list_id: listId,
            restaurant_id: restaurantId,
            user_id: userStore.user.id,
            ...(listRestaurant && {
              id: listRestaurant.id,
            }),
          },
          ...(listRestaurant && {
            on_conflict: {
              constraint: list_restaurant_constraint.list_restaurant_id_key,
              update_columns: [
                list_restaurant_update_column.position,
                list_restaurant_update_column.comment,
              ],
            },
          }),
        })?.__typename
      })
      console.log('added, refreshing')
      await Promise.all([refetch(list), refetch(list_restaurants)])
    },
    async sort({ data }: DragEndParams<typeof items>) {
      await setOrder(data.flat().map((x) => x.restaurantId))
    },
    async delete(id: string) {
      await mutate((mutation) => {
        const affected = mutation.delete_list_restaurant({
          where: {
            restaurant_id: {
              _eq: id,
            },
          },
        })?.affected_rows
        if (affected === 0) {
          Toast.error(`Didn't delete...`)
        }
        return affected
      })
      await Promise.all([refetch(list), refetch(list_restaurants)])
    },
  }
}
