import { query, resolved } from '@dish/graph'
import { isPresent } from '@dish/helpers'
import { debounce, differenceBy } from 'lodash'

import { FullTag, NavigableTag, TagWithNameAndType } from '../types/tagTypes'
import { addTagsToCache, allTags } from './allTags'
import { getFullTag } from './getFullTag'

type TagPartial =
  | TagWithNameAndType
  | NavigableTag
  | { name?: string; type?: string; slug: string }

const noIdTagSlugs = new Set<string>()

const hydrateIds = debounce(async () => {
  if (!noIdTagSlugs.size) {
    return
  }
  const slugs = [...noIdTagSlugs]
  noIdTagSlugs.clear()
  const full = await fetchFullTags(slugs.map((slug) => ({ slug })))
  addTagsToCache(full)
}, 500)

export async function getFullTags(tags: TagPartial[]): Promise<FullTag[]> {
  const missingTag = tags.some((x) => !x.slug && !x.name && !x.type)
  if (missingTag) {
    throw new Error(`Needs name + type or slug: ${JSON.stringify(missingTag)}`)
  }
  const cached: FullTag[] = []
  const uncached: TagPartial[] = []

  for (const tag of tags) {
    const found = tag.slug ? allTags[tag.slug] : null
    if (found) {
      if (!found.id) {
        if ('id' in tag) {
          found.id = tag.id
        } else {
          const slug = found.slug || tag.slug
          if (slug) {
            noIdTagSlugs.add(slug)
          }
        }
      }
      cached.push(found)
    } else {
      uncached.push(tag)
    }
  }

  hydrateIds()

  if (!uncached.length) {
    return cached
  }

  const uncachedFull = await fetchFullTags(uncached)
  addTagsToCache(uncachedFull)
  const res = [...cached, ...uncachedFull]
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

async function fetchFullTags(tags: TagPartial[]) {
  const all = await resolved(
    () => {
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
    },
    {
      noCache: true,
    }
  )
  return all.filter(isPresent)
}
