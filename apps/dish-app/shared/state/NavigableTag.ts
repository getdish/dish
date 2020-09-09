import { Tag } from '@dish/graph'

export type NavigableTag = Partial<Tag> & Pick<Tag, 'name' | 'type'>
