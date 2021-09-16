import { sleep } from '@dish/async'
import {
  list,
  list_restaurant_constraint,
  list_restaurant_update_column,
  mutate,
  order_by,
  useRefetch,
} from '@dish/graph'
import { assertPresent } from '@dish/helpers'
import { useState } from 'react'
import { DragEndParams } from 'react-native-draggable-flatlist'
import { useDebounce } from 'snackui'

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

  const orderNow = items.map((x) => x.id)
  const [orderOverride, setOrderOverride] = useState<string[]>()

  const mutateOrder = useDebounce(
    async (ids: string[]) => {
      await mutate((mutation) => {
        // seed because it doesnt do it all in one step causing uniqueness violations
        const seed = Math.floor(Math.random() * 10000)
        assertPresent(list, 'no list')
        const positions = ids.map((_, position) => (position + 1) * seed)
        for (const [index, id] of ids.entries()) {
          const position = positions[index]
          console.log('set', id, position, listId)
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

  const setOrder = (ids: string[]) => {
    setOrderOverride(ids)
    mutateOrder(ids)
  }

  return {
    // list_restaurants,
    items: (orderOverride || orderNow).map((id) => items.find((x) => x.id === id)),
    setOrder,
    async add(restaurantId: string) {
      await mutate((mutation) => {
        assertPresent(list, 'no list')
        assertPresent(userStore.user, 'no user')
        const listRestaurant = items.find((x) => x.restaurantId === restaurantId)
        return mutation.insert_list_restaurant_one({
          object: {
            // space it out (insert at top = -1)
            position: -items.length * Math.round((1000 - items.length) * Math.random()),
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
    async promote(index: number) {
      if (index == 0) return
      const now = items.map((x) => x.restaurant.id as string)
      const next = promote(now, index)
      console.log('setting order', next)
      await setOrder(next)
    },
    async sort({ data, from, to }: DragEndParams<typeof items>) {
      console.log(data, from, to)
      await setOrder(data.flat().map((x) => x.id))
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
    // async setComment(id: string, comment: string) {
    //   await mutate((mutation) => {
    //     return mutation.update_list_restaurant_by_pk({
    //       pk_columns: {
    //         list_id: listId,
    //         restaurant_id: id,
    //       },
    //       _set: {
    //         comment,
    //       },
    //     })?.__typename
    //   })
    //   await refetch(list)
    // },
    // async setDishes(id: string, dishTags: string[]) {
    //   const { dishQuery } = items.find((x) => x.restaurantId === id) ?? {}
    //   const rtagids = await resolved(() =>
    //     query.restaurant_tag({ where: { tag: { slug: { _in: dishTags } } } }).map((x) => x.id)
    //   )
    //   await mutate((mutation) => {
    //     // immutable style
    //     // first delete old ones
    //     mutation.delete_list_restaurant_tag({
    //       where: {
    //         list_restaurant_id: {
    //           _eq: id,
    //         },
    //       },
    //     })?.__typename
    //     // then add news ones
    //     assertPresent(list, 'no list')
    //     assertPresent(userStore.user, 'no user')
    //     for (const [position, rid] of rtagids.entries()) {
    //       mutation.insert_list_restaurant_tag_one({
    //         object: {
    //           restaurant_tag_id: rid,
    //           list_restaurant_id: id,
    //           list_id: list.id,
    //           user_id: userStore.user.id,
    //           position,
    //         },
    //       })?.__typename
    //     }
    //   })
    //   await refetch(dishQuery)
    // },
  }
}
