import { Tag } from '@dish/graph'

export const tagDisplayName = (tag: Tag) =>
  tag.displayName ?? tagDisplayNames[tag.name ?? ''] ?? tag.name ?? ''

export const tagDisplayNames = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  'price-higher': '$$$',
  Vibe: 'Vibe',
  Veg: 'Green',
  Drink: 'Bar',
  Gems: 'Gem',
}

export const tagDisplayIcons = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  Vibe: 'Date',
  Veg: 'Green',
  Drink: 'Drink',
  Gems: 'Gem',
}
