import { query, tag_constraint } from '../graphql'
import { Tag, TagWithId } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { findOne, insert, update, upsert } from './queryHelpers'
import { resolveFields } from './resolveFields'
import { slugify } from './slugify'
import { tagTagUpsert } from './tag_tag'

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name)

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
  return await resolveFields(allFieldsForTable('tag'), () => {
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
  return await resolveFields(allFieldsForTable('tag'), () => {
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
): Promise<void> {
  const objects = category_tag_ids.map((category_tag_id) => {
    return {
      category_tag_id,
      // @ts-ignore
      tag_id: tag.id,
    }
  })
  console.warn('disabled bad type for now')
  await tagTagUpsert(objects)
}
