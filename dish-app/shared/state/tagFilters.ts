import { Tag } from '@dish/graph'

// TODO pull these from backend (script? babel preval?)

export const tagFilters: Tag[] = [
  {
    id: 'x1000000-0000-0000-0000-000000000000',
    name: 'Open',
    type: 'filter',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: 'x2000000-0000-0000-0000-000000000000',
    name: 'Delivery',
    type: 'filter',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: 'x3000000-0000-0000-0000-000000000000',
    name: 'price-low',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
    stack: true,
  },
  {
    id: 'x4000000-0000-0000-0000-000000000000',
    name: 'price-mid',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
  {
    id: 'x5000000-0000-0000-0000-000000000000',
    name: 'price-high',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
]
