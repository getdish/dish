import { Tag } from '@dish/graph'

import { LngLat } from '../app/state/home-types'

export type AutocompleteItem = {
  is: 'autocomplete'
  id?: string
  icon?: string
  name: string
  description?: string
  tagId?: string
  slug?: string
  type: Tag['type'] | 'restaurant'
  center?: LngLat
  span?: LngLat
}

export function createAutocomplete(
  item: Partial<AutocompleteItem>
): AutocompleteItem {
  return {
    id: `${Math.random()}`,
    is: 'autocomplete',
    name: '',
    type: 'dish',
    ...item,
    tagId: item.slug,
  }
}
