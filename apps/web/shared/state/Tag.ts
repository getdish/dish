import { Tag as TagModel, TagType } from '@dish/models'

export type Tag = {
  id: string
  name: string
  displayName?: string
  icon?: string
  rgb?: [number, number, number]
  description?: string
  type: TagType
  isActive?: boolean
  isVotable?: boolean
}

export type NavigableTag = Partial<Tag> & Pick<Tag, 'name' | 'type'>

export const getTagId = (tag: NavigableTag) => {
  const tag_model = new TagModel(tag)
  return tag_model.slug()
}

export const tagLenses: Tag[] = [
  {
    id: '3',
    name: 'Gems',
    icon: ' 💎',
    rgb: [0.6, 0.1, 0.5],
    description: 'The best 🍔',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Date',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    description: 'A nice place for 🍔',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Coffee',
    icon: '☕',
    rgb: [0.35, 0.2, 0.65],
    description: '🍔 & coffee',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '5',
    name: 'Wine',
    icon: '🍷',
    rgb: [0.35, 0.2, 0.65],
    description: '🍔 & drinks',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '9',
    name: 'Vegetarian',
    icon: '🥬',
    rgb: [0.05, 0.8, 0.15],
    description: 'Vegetarian 🍔',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Quiet',
    icon: '👨‍💻',
    rgb: [0.35, 0.2, 0.65],
    description: 'Low-key 🍔',
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
    name: 'Delivers',
    type: 'filter',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: '71',
    name: 'Healthy',
    type: 'filter',
    // @ts-ignore
    groupId: 'preferences',
  },
  {
    id: '81',
    name: 'Quick',
    type: 'filter',
    // @ts-ignore
    groupId: 'preferences',
  },
  {
    id: '91',
    name: 'Planty',
    type: 'filter',
    // @ts-ignore
    groupId: 'preferences',
  },
]
