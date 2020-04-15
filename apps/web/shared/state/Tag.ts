import { TagType, slugify } from '@dish/models'

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
  return `${slugify(tag.type)}${slugify(tag.name)}`
}

export const tagLenses: Tag[] = [
  {
    id: '0',
    name: 'Unique',
    icon: '⭐️',
    rgb: [0.8, 0.1, 0.1],
    description: 'Uniquely good',
    type: 'lense',
  },
  {
    id: '3',
    name: 'Gem',
    icon: ' 💎',
    rgb: [0.6, 0.1, 0.5],
    description: 'Best tasting',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '5',
    name: 'Wine',
    icon: '🍷',
    rgb: [0.35, 0.2, 0.65],
    description: 'Good drinks',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Meet',
    icon: '☕',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date spots',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Date',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date spots',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Work',
    icon: '👨‍💻',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date spots',
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
    name: '🥬',
    type: 'filter',
    // @ts-ignore
    // groupId: 'preferences',
  },
]
