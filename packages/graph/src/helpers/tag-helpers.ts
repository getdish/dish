import { query, tag_constraint } from '../graphql'
import { Tag, TagQuery, TagTag, TagWithId } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'
import { tagTagUpsert } from './tag_tag-helpers'

const QueryHelpers = createQueryHelpersFor<Tag>('tag')
export const tagInsert = QueryHelpers.insert
export const tagUpsert = QueryHelpers.upsert
export const tagUpdate = QueryHelpers.update
export const tagFindOne = QueryHelpers.findOne
export const tagRefresh = QueryHelpers.refresh

export const tagFindOneWithCategories = async (tag: Tag) => {
  return await tagFindOne(tag, {
    relations: ['categories.category'],
  })
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
  tag: TagWithId,
  category_tag_ids: string[]
) {
  const objects = category_tag_ids.map<TagTag>((tag_id) => ({
    category_tag_id: tag_id,
    tag_id: tag.id,
  }))
  return await tagTagUpsert(objects)
}

export function tagAddAlternate(tag: Tag, alternate: string) {
  if (alternate != tag.name) {
    // @ts-ignore
    tag.alternates = tag.alternates || []
    // @ts-ignore
    tag.alternates?.push(alternate)
    // @ts-ignore
    tag.alternates = [...new Set(tag.alternates)]
  }
}
