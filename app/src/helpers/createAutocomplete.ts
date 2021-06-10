import { LngLat } from '../types/homeTypes'

type Base = {
  icon?: string
  name: string
  description?: string
  namePrefix?: string
}

export type AutocompleteItemRestuarant = Base & {
  type: 'restaurant'
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
  | (Base & AutocompleteItemRestuarant)
  | (Base & AutocompleteItemLocation)

export type AutocompleteItemFull = AutocompleteItem & {
  is: 'autocomplete'
  id: string
}

export function createAutocomplete<A extends Base = any>(
  item: AutocompleteItem
): A & AutocompleteItemFull {
  return {
    id:
      item['slug'] ??
      (item['center'] ? JSON.stringify(item['center']) : null) ??
      `${Math.random()}`,
    is: 'autocomplete',
    ...item,
    type: item.type as any,
  } as any
}
