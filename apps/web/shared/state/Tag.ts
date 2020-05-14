import { TagType } from '@dish/graph'
import { tagSlug } from '@dish/models'

type TagDescriptionKey = 'dish' | 'cuisine' | 'plain'

export type Tag = {
  id: string
  name: string
  displayName?: string
  icon?: string
  rgb?: [number, number, number]
  descriptions?: { [type in TagDescriptionKey]: string }
  type: TagType
  isActive?: boolean
  isVotable?: boolean
}

export type NavigableTag = Partial<Tag> & Pick<Tag, 'name' | 'type'>

export const getTagId = (tag: NavigableTag) => {
  if (!tag.name) {
    console.warn('no name tag', tag)
    return 'no-slug'
  }
  return tagSlug(tag)
}

export const tagLenses: Tag[] = [
  {
    id: '3',
    name: 'Gems',
    icon: ' 💎',
    rgb: [0.6, 0.1, 0.5],
    descriptions: {
      dish: 'The best 🍔',
      cuisine: 'The Best 🍔 Restaurants',
      plain: 'Uniquely Good Here',
    },
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Date',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    descriptions: {
      dish: 'A nice place for 🍔',
      cuisine: 'Nice 🍔 for a Date',
      plain: 'Best Date Night Spots',
    },
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Coffee',
    icon: '☕',
    rgb: [0.35, 0.2, 0.65],
    descriptions: {
      dish: '🍔 & coffee',
      cuisine: '🍔 Food & Coffee',
      plain: 'Top Coffee Shops',
    },
    type: 'lense',
    isVotable: true,
  },
  {
    id: '5',
    name: 'Drink',
    icon: '🍷',
    rgb: [0.35, 0.2, 0.65],
    descriptions: {
      dish: '🍔 & drinks',
      cuisine: '🍔 with a Bar',
      plain: 'Uniquely Good Drinks',
    },
    type: 'lense',
    isVotable: true,
  },
  {
    id: '9',
    name: 'Vegetarian',
    icon: '🥬',
    rgb: [0.05, 0.8, 0.15],
    descriptions: {
      dish: 'Vegetarian 🍔',
      cuisine: 'Vegetarian 🍔 Restaurants',
      plain: 'Uniquely Good Vegetarian',
    },
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Quiet',
    icon: '👨‍💻',
    rgb: [0.35, 0.2, 0.65],
    descriptions: {
      dish: 'Low-key 🍔',
      cuisine: 'Quiet 🍔 Restaurants',
      plain: 'Quiet, Work-friendly Spots',
    },
    type: 'lense',
    isVotable: true,
  },
]

export const tagFilters: Tag[] = [
  {
    id: '01',
    name: 'cheap',
    displayName: '$',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
    stack: true,
  },
  {
    id: '21',
    name: 'midrange',
    displayName: '$$',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
  {
    id: '31',
    name: 'expensive',
    displayName: '$$$',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
  {
    id: '41',
    name: 'Open',
    type: 'filter',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: '61',
    name: 'Delivery',
    type: 'filter',
    // @ts-ignore
    groupId: 'basics',
  },
  // {
  //   id: '71',
  //   name: 'Healthy',
  //   type: 'filter',
  //   // @ts-ignore
  //   groupId: 'preferences',
  // },
  // {
  //   id: '81',
  //   name: '',
  //   type: 'filter',
  //   // @ts-ignore
  //   groupId: 'preferences',
  // },
  // {
  //   id: '91',
  //   name: 'Planty',
  //   type: 'filter',
  //   // @ts-ignore
  //   groupId: 'preferences',
  // },
]
