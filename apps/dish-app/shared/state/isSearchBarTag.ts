import { Tag } from '@dish/graph'

export const isSearchBarTag = (tag: Pick<Tag, 'type'>) =>
  tag?.type != 'lense' && tag.type != 'filter'
