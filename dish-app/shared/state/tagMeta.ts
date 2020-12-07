import { Tag } from '@dish/graph'

export const tagDisplayName = (
  tag: Partial<Pick<Tag, 'displayName' | 'name'>>
) => tag.displayName ?? tagDisplayNames[tag.name ?? ''] ?? tag.name ?? ''

export const tagDisplayNames = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  'price-higher': '$$$',
  Vibe: 'Vibe',
  Veg: 'Green',
  Drinks: 'Drink',
  Gems: 'Top',
}

export const tagDisplayIcons = {
  'price-low': '$',
  'price-mid': '$$',
  'price-high': '$$$',
  Vibe: 'Date',
  Veg: 'Green',
  Drinks: 'Drink',
  Gems: 'Top',
}

export const tagDescriptions = {
  gems: {
    dish: 'The best 🍔',
    cuisine: 'The Best 🍔 Restaurants',
    plain: 'Uniquely Good',
  },
  vibe: {
    dish: 'Nice 🍔',
    cuisine: 'Vibey 🍔',
    plain: 'Vibes',
  },
  drink: {
    dish: '🍔 & drinks',
    cuisine: '🍔 with a bar',
    plain: 'Good Drinks',
  },
  veg: {
    dish: 'The best Vegetarian 🍔',
    cuisine: 'Vegetarian 🍔 Restaurants',
    plain: 'Vegetarian',
  },
}

export const tagGroup = {
  'filters__price-low': 0,
  'filters__price-mid': 0,
  'filters__price-high': 0,
}

export const tagSort = {
  'filters__price-low': 0,
  'filters__price-mid': 1,
  'filters__price-high': 2,
}
