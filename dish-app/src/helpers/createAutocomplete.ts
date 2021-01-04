import { LngLat } from '../types/homeTypes'

type Base = {
  icon?: string
  name: string
  description?: string
}

export type AutocompleteItem =
  | (Base & { type: 'orphan' })
  | (Base & { type: 'dish' | 'cuisine' | 'country'; slug: string })
  | (Base & { type: 'restaurant'; slug: string })
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
