import { resolved } from 'gqless'

import { query } from '../graphql'
import { Tag } from '../types'
import { allFieldsForTable } from './allFieldsForTable'
import { upsert } from './queryHelpers'
import { resolveFields } from './resolveFields'
import { slugify } from './slugify'
import { tagTagUpsert } from './tag_tag'

export const tagSlug = (tag: Pick<Tag, 'name'>) => slugify(tag.name)

export async function tagUpsert(objects: Tag[]) {
  return await upsert<Tag>('tag_tag', 'tag_parentId_name_key', objects)
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
): Promise<Tag[]> {
  const objects = category_tag_ids.map((category_tag_id) => {
    return {
      category_tag_id,
      // @ts-ignore
      tag_id: tag.id,
    }
  })
  return await tagTagUpsert(objects)
}
