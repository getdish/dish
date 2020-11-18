import { omit } from 'lodash'

import { menu_item_constraint } from '../graphql'
import { MenuItem } from '../types'
import { createQueryHelpersFor } from './queryHelpers'

const QueryHelpers = createQueryHelpersFor<MenuItem>(
  'menu_item',
  menu_item_constraint.menu_item_restaurant_id_name_key
)
export const menuItemInsert = QueryHelpers.insert
export const menuItemUpsert = QueryHelpers.upsert
export const menuItemUpdate = QueryHelpers.update
export const menuItemFindOne = QueryHelpers.findOne
export const menuItemFindAll = QueryHelpers.findAll
export const menuItemRefresh = QueryHelpers.refresh

export const menuItemsUpsertMerge = async (items: Partial<MenuItem>[]) => {
  const restaurant_id = items[0].restaurant_id
  const existing_items = await menuItemFindAll({ restaurant_id })
  let updated_items: Partial<MenuItem>[] = []
  for (let item of items) {
    const matches = updated_items.filter((i) => {
      return i.name == item.name
    })
    if (matches.length > 0) continue
    const match = existing_items.find(
      (e) => e.name == item.name && e.price == item.price
    )
    if (match) {
      item = merge(match, item)
    }
    updated_items.push(omit(item, 'restaurant'))
  }
  await menuItemUpsert(updated_items)
}

// Only update _missing_ data
const merge = (original: Partial<MenuItem>, incoming: Partial<MenuItem>) => {
  for (const key of Object.keys(incoming)) {
    if (!original[key] ?? original[key].trim() == '') {
      original[key] = incoming[key]
    }
  }
  return original
}
