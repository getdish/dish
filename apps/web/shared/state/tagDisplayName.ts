import { Tag } from '@dish/graph'

export const tagDisplayName = (tag: Tag) =>
  tagDisplayNames[tag.name] ?? tag.displayName ?? tag.name ?? ''

export const tagDisplayNames = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  Veg: 'Plant',
  Drink: 'Sip',
  Gems: 'Gem',
}
