import { slugify } from '@dish/common-web'
import { Tag } from '@dish/graph'

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name)
