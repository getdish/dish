import { Tag } from '@dish/graph'

export type FullTag = Required<
  Pick<Tag, 'name' | 'id' | 'icon' | 'type' | 'rgb' | 'slug'>
>

export type TagWithNameAndType =
  | Tag
  | {
      name: FullTag['name']
      type: FullTag['type']
      slug?: string
    }
