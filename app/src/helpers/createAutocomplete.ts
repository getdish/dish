import { LngLat } from '../types/homeTypes'

type Base = {
  id?: string
  icon?: string
  name: string
  description?: string
  namePrefix?: string
}

export type AutocompleteItemRestuarant = Base & {
  type: 'restaurant'
  slug: string
}

export type AutocompleteItemUser = Base & {
  type: 'user'
  slug: string
}

export type AutocompleteItemLocation = Base & {
  type: 'place'
  center?: LngLat
  span?: LngLat
  slug?: string
}

export type AutocompleteItem =
  | (Base & { type: 'orphan' })
  | (Base & { type: 'dish' | 'cuisine' | 'country'; slug: string })
  | AutocompleteItemRestuarant
  | AutocompleteItemLocation
  | AutocompleteItemUser

export type AutocompleteItemFull = AutocompleteItem & {
  is: 'autocomplete'
  id: string
}

export function createAutocomplete<A extends Base = any>(
  item: AutocompleteItem
): A & AutocompleteItemFull {
  return {
    id:
      item['id'] ?? (item['center'] ? JSON.stringify(item['center']) : null) ?? `${Math.random()}`,
    slug: item['slug'],
    is: 'autocomplete',
    ...item,
    type: item.type as any,
  } as any
}
