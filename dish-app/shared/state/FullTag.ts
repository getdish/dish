import { Tag } from '@dish/graph'

export type FullTag = Required<
  Pick<Tag, 'name' | 'id' | 'icon' | 'type' | 'rgb' | 'slug'>
>
