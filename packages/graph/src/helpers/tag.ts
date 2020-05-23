import { query, tag_constraint } from '../graphql'
import { Tag, TagTag, TagWithId } from '../types'
import { findOne, insert, update, upsert } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'
import { slugify } from './slugify'
import { tagTagUpsert } from './tag_tag'

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name ?? '')

export async function tagInsert(tags: Tag[]) {
  return await insert<Tag>('tag', tags)
}

export async function tagUpsert(
  objects: Tag[],
  constraint = tag_constraint.tag_parentId_name_key
) {
  return await upsert<Tag>('tag', constraint, objects)
}

export async function tagUpdate(tag: TagWithId) {
  return await update<TagWithId>('tag', tag)
}

export async function tagFindOne(tag: Partial<Tag>) {
  return await findOne<TagWithId>('tag', tag)
}

export async function tagGetAllChildren(
  parents: Pick<Tag, 'id'>[]
): Promise<Tag[]> {
  return await resolvedWithFields(() => {
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
  return await resolvedWithFields(() => {
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
