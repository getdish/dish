import { Tag } from '@dish/graph'

export const tagFilters: Tag[] = [
  {
    id: '6ba8fef3-25fb-4494-91f5-3c44cdbb8f4b',
    name: 'Open',
    type: 'filter',
    slug: 'filter__open',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: 'c5318460-a925-4f88-aaa8-232ec3faa893',
    name: 'Delivery',
    type: 'filter',
    slug: 'filter__delivery',
    // @ts-ignore
    groupId: 'basics',
  },
  {
    id: 'ed6de29e-2dc1-4f2a-98a1-bd99e24406e8',
    name: 'price-low',
    type: 'filter',
    slug: 'filters__price-low',
    // @ts-ignore
    groupId: 'price',
    stack: true,
  },
  {
    id: '19610cd0-cc12-401a-bc65-f2289c92ef2b',
    name: 'price-mid',
    type: 'filter',
    slug: 'filters__price-mid',
    // @ts-ignore
    groupId: 'price',
  },
  {
    id: '507e6614-3265-4857-8911-a9ffbd45e212',
    name: 'price-high',
    type: 'filter',
    slug: 'filters__price-high',
    // @ts-ignore
    groupId: 'price',
  },
]
