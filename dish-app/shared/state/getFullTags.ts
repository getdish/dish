import { query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { differenceBy } from 'lodash'

import { allTags } from './allTags'
import { FullTag } from './FullTag'
import { getFullTag } from './getFullTag'
import { guessTagSlug } from './getTagSlug'
import { TagWithNameAndType } from './TagWithNameAndType'

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
    const found = tag.slug && allTags[tag.slug]
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
              ...(tag.slug && {
                slug: {
                  _eq: tag.slug,
                },
              }),
              ...(!tag.slug && {
                name: { _eq: tag.name },
                type: { _eq: tag.type },
              }),
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
      tags,
      res,
      differenceBy(res, tags, (x) => x.name)
    )
  }

  return res
}
