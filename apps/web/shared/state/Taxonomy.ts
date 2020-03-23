export type Taxonomy = {
  id: string
  name: string
  icon?: string
  rgb?: [number, number, number]
  description?: string
  type: 'lense' | 'filter' | 'dish' | 'country'
  isActive?: boolean
}

export const taxonomyLenses: Taxonomy[] = [
  {
    id: '0',
    name: 'Overall',
    icon: '⭐️',
    rgb: [0.8, 0.1, 0.1],
    description: 'Most popular',
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
  },
  {
    id: '4',
    name: 'Date Night',
    icon: '🌃',
    rgb: [0.35, 0.2, 0.65],
    description: 'Date night',
    type: 'lense',
  },
  {
    id: '6',
    name: 'Planty',
    icon: '🥬',
    rgb: [0.2, 0.7, 0.2],
    description: 'Plant based',
    type: 'lense',
  },
  {
    id: '7',
    name: 'Seafood',
    icon: '🐟',
    rgb: [0.65, 0.2, 0.65],
    description: 'Seafood',
    type: 'lense',
  },
  {
    id: '8',
    name: 'Cheap',
    icon: '💸',
    rgb: [0.65, 0.2, 0.65],
    description: 'Cheap',
    type: 'lense',
  },
]

export const taxonomyFilters: Taxonomy[] = [
  {
    id: '0',
    name: '$',
    type: 'filter',
  },
  {
    id: '2',
    name: '$$',
    type: 'filter',
  },
  {
    id: '3',
    name: '$$$',
    type: 'filter',
  },
  {
    id: '4',
    name: 'Open Now',
    type: 'filter',
  },
  {
    id: '6',
    name: 'Delivers',
    type: 'filter',
  },
  {
    id: '7',
    name: 'Healthy',
    type: 'filter',
  },
  {
    id: '8',
    name: 'Quick',
    type: 'filter',
  },
]
