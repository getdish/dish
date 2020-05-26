import { uniq } from 'lodash'

import { query, tag_constraint } from '../graphql'
import { Tag, TagTag } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'
import { slugify } from './slugify'
import { tagTagUpsert } from './tag_tag'

type TagWithParent = Tag & {
  parent: { name: string }
}

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name ?? '')

export const tagSlugDisambiguated = (tag: TagWithParent) => {
  return `${slugify(tagSlug(tag.parent))}__${tagSlug(tag)}`
}

export const tagSlugs = (tag: Tag) => {
  let parentage: string[] = []
  if (!tagIsOrphan(tag)) {
    parentage = [tagSlug(tag.parent!), tagSlugDisambiguated(tag)]
  }
  const category_names = (tag.categories || []).map((i) =>
    slugify(i.category.name)
  )
  const all = [tagSlug(tag), ...parentage, ...category_names].flat()
  return uniq(all)
}

export const tagIsOrphan = (tag: Tag) => {
  return tag.parent!.id == '00000000-0000-0000-0000-000000000000'
}

const QueryHelpers = createQueryHelpersFor<Tag>(
  'tag',
  tag_constraint.tag_parentId_name_key
)
export const tagInsert = QueryHelpers.insert
export const tagUpsert = QueryHelpers.upsert
export const tagUpdate = QueryHelpers.update
export const tagFindOne = QueryHelpers.findOne
export const tagRefresh = QueryHelpers.refresh

export async function tagGetAllChildren(
  parents: Pick<Tag, 'id'>[]
): Promise<Tag[]> {
  return await resolvedWithFields('tag', () => {
    return query.tag({
      where: {
        parentId: {
          _in: parents,
        },
      },
    })
  })
}

export async function tagFindCountries(countries: string[]): Promise<Tag[]> {
  return await resolvedWithFields('tag', () => {
    return query.tag({
      where: {
        _or: [
          { name: { _in: countries } },
          { alternates: { _has_keys_any: countries } },
        ],
        type: { _eq: 'country' },
      },
    })
  })
}

export async function tagUpsertCategorizations(
  tag: Tag,
  category_tag_ids: string[]
) {
  const objects: TagTag[] = category_tag_ids.map((category_tag_id) => {
    return {
      category_tag_id,
      tag_id: tag.id,
    }
  })
  return await tagTagUpsert(objects)
}
