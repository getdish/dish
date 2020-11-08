import { Tag } from '@dish/graph'

export type NavigableTag = Partial<Tag> &
  (Required<Pick<Tag, 'name' | 'type'>> | Required<Pick<Tag, 'slug'>>)
