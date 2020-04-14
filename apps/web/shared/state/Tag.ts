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
    name: 'Food',
    icon: '🍽',
    rgb: [0.6, 0.1, 0.5],
    description: 'Top food',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '4',
    name: 'Ambiance',
    icon: '✨',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '5',
    name: 'Good drink',
    icon: '🍷',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Good date',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date',
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
  },
  {
    id: '61',
    name: 'Delivers',
    type: 'filter',
  },
  {
    id: '71',
    name: 'Healthy',
    type: 'filter',
  },
  {
    id: '91',
    name: '🥬',
    type: 'filter',
  },
  {
    id: '81',
    name: 'Quick',
    type: 'filter',
  },
]
