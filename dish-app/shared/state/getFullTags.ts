import { Tag, query, resolved } from '@dish/graph'

import { FullTag } from './FullTag'

export type TagWithNameAndType = Tag & {
  name: FullTag['name']
  type: FullTag['type']
}

export function getFullTag(tag: Tag): FullTag | null {
  if (!tag) {
    return null
  }
  return {
    id: tag.id,
    name: tag.name!,
    type: tag.type!,
    icon: tag.icon!,
    rgb: typeof tag.rgb === 'function' ? tag.rgb() : tag.rgb,
    slug: tag.slug!,
  }
}

export async function getFullTags(
  tags: TagWithNameAndType[]
): Promise<FullTag[]> {
  if (tags.some((x) => !x.name || !x.type)) {
    throw new Error(`Needs name + type to find`)
  }
  return await resolved(() => {
    return tags.map((tag) => {
      return getFullTag(
        query.tag({
          where: {
            name: { _eq: tag.name },
            type: { _eq: tag.type },
          },
          limit: 1,
        })[0]
      )
    })
  })
}
