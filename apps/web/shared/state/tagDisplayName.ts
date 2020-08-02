import { Tag } from '@dish/graph'

export const tagDisplayName = (tag: Tag) =>
  tagDisplayNames[tag.name ?? ''] ?? tag.displayName ?? tag.name ?? ''

export const tagDisplayNames = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  Vibe: 'Vibe',
  Veg: 'Green',
  Drink: 'Drink',
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
