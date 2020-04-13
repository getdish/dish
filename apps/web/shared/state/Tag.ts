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
    name: 'Unique Here',
    icon: '⭐️',
    rgb: [0.8, 0.1, 0.1],
    description: 'Uniquely good here',
    type: 'lense',
  },
  {
    id: '2',
    name: 'New',
    icon: '🔥',
    rgb: [0.5, 0.1, 0.1],
    description: 'New',
    type: 'lense',
  },
  {
    id: '3',
    name: 'Picks',
    icon: '👩‍🍳',
    rgb: [0.6, 0.1, 0.5],
    description: 'Chef choice',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '4',
    name: 'Date Night',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date night',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '6',
    name: 'Planty',
    icon: '🥬',
    rgb: [0.2, 0.7, 0.2],
    description: 'Plant based',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '7',
    name: 'Seafood',
    icon: '🐟',
    rgb: [0.65, 0.2, 0.65],
    description: 'Seafood',
    type: 'lense',
    isVotable: true,
  },
  {
    id: '8',
    name: 'Cheap',
    icon: '💸',
    rgb: [0.65, 0.2, 0.65],
    description: 'Cheap',
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
  },
  {
    id: '21',
    name: 'midrange',
    displayName: '$$',
    type: 'filter',
  },
  {
    id: '31',
    name: 'expensive',
    displayName: '$$$',
    type: 'filter',
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
    id: '81',
    name: 'Quick',
    type: 'filter',
  },
]
