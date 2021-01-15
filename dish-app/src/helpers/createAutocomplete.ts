import { LngLat } from '../types/homeTypes'

type Base = {
  icon?: string
  name: string
  description?: string
}

export type AutocompleteItemRestuarant = Base & {
  type: 'restaurant'
  slug: string
}

export type AutocompleteItem =
  | (Base & { type: 'orphan' })
  | (Base & { type: 'dish' | 'cuisine' | 'country'; slug: string })
  | AutocompleteItemRestuarant
  | (Base & { type: 'place'; center?: LngLat; span?: LngLat })

export type AutocompleteItemFull = AutocompleteItem & {
  is: 'autocomplete'
  id: string
}

export function createAutocomplete(
  item: AutocompleteItem
): AutocompleteItemFull {
  return {
    id:
      item['slug'] ??
      (item['center'] ? JSON.stringify(item['center']) : null) ??
      `${Math.random()}`,
    is: 'autocomplete',
    name: '',
    ...item,
    type: item.type as any,
  }
}
