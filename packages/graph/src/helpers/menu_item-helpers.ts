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

export const menuItemsUpsertMerge = async (items: MenuItem[]) => {
  const restaurant_id = items[0].restaurant_id
  const existing_items = await menuItemFindAll({ restaurant_id })
  for (let item of items) {
    const match = existing_items.find(
      (e) => e.name == item.name && e.price == item.price
    )
    if (match) {
      item = merge(match, item)
    }
  }
  await menuItemUpsert(items)
}

// Only update _missing_ data
const merge = (original: MenuItem, incoming: MenuItem) => {
  for (const key of Object.keys(incoming)) {
    if (!original[key] ?? original[key].trim() == '') {
      original[key] = incoming[key]
    }
  }
  return original
}
