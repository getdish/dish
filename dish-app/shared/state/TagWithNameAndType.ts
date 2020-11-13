import { Tag } from '@dish/graph'

import { FullTag } from './FullTag'

export type TagWithNameAndType =
  | Tag
  | {
      name: FullTag['name']
      type: FullTag['type']
      slug?: string
    }
