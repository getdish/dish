import { Tag } from '@dish/graph'

export const tagFilters: Tag[] = [
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
  {
    id: '01',
    name: 'price-low',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
    stack: true,
  },
  {
    id: '21',
    name: 'price-mid',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
  {
    id: '31',
    name: 'price-high',
    type: 'filter',
    // @ts-ignore
    groupId: 'price',
  },
]
