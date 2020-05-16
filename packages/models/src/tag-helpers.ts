import { Tag, slugify } from '@dish/graph'

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name)
