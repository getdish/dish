import { Tag } from '@dish/graph'

import { LngLat } from './state/home-types'

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
