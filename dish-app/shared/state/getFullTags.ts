import { Tag, query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'

import { allTags } from './allTags'
import { FullTag } from './FullTag'
import { getFullTag } from './getFullTag'
import { guessTagSlug } from './getTagSlug'

export type TagWithNameAndType = Tag & {
  name: FullTag['name']
  type: FullTag['type']
}

type TagPartial =
  | TagWithNameAndType
  | { name?: string; type?: string; slug: string }

export async function getFullTags(tags: TagPartial[]): Promise<FullTag[]> {
  const missingTag = tags.some((x) => !x.slug && !x.name && !x.type)
  if (missingTag) {
    throw new Error(`Needs name + type or slug: ${JSON.stringify(missingTag)}`)
  }
  const cached: FullTag[] = []
  const uncached: TagPartial[] = []

  for (const tag of tags) {
    const found = allTags[guessTagSlug(tag)]
    if (found) {
      cached.push(found)
    } else {
      uncached.push(tag)
    }
  }

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
    console.warn(
      'didnt find some tags',
      tags.filter((x) => !res.some((y) => y.name === x.name))
    )
  }

  return res
}
