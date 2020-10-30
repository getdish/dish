import { Tag, query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers/_'

import { allTags } from './allTags'
import { FullTag } from './FullTag'
import { guessTagSlug } from './getTagSlug'

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
  const cached: FullTag[] = []
  const uncached: TagWithNameAndType[] = []

  for (const tag of tags) {
    const found = allTags[guessTagSlug(tag)]
    if (found) {
      cached.push(found)
    } else {
      uncached.push(tag)
    }
  }

  console.log('got', tags, cached, uncached)

  if (!uncached.length) {
    return cached
  }

  const res = [
    ...cached,
    ...(await resolved(() => {
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
    })),
  ].filter(isPresent)

  if (res.length !== tags.length) {
    debugger
  }

  return res
}
