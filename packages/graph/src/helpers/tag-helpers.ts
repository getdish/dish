// import { order_by, query } from '../graphql'
import { order_by, query, selectFields, tag } from '../graphql/new-generated'
import { Tag, TagTag, TagWithId } from '../types'
import { createQueryHelpersFor } from './queryHelpers'
import { resolvedWithFields } from './queryResolvers'
import { tagTagUpsert } from './tag_tag-helpers'

const QueryHelpers = createQueryHelpersFor<Tag>('tag')
export const tagInsert = QueryHelpers.insert
export const tagUpsert = QueryHelpers.upsert
export const tagUpdate = QueryHelpers.update
export const tagFindOne = QueryHelpers.findOne
export const tagDelete = QueryHelpers.delete
export const tagRefresh = QueryHelpers.refresh

export const tagFindOneWithCategories = async (tag: Tag) => {
  return await tagFindOne(tag, (tagV: tag) => {
    return {
      ...selectFields(tagV),
      categories: tagV.categories().map((catV) => {
        return {
          ...selectFields(catV),
        }
      }),
      alternates: tagV.alternates(),
    }
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

export async function tagFindCountryMatches(
  countries: string[]
): Promise<Tag[]> {
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

export async function tagGetAllGenerics(): Promise<Tag[]> {
  return await resolvedWithFields(() => {
    return query.tag({
      where: {
        _or: [
          { type: { _eq: 'filter' } },
          { type: { _eq: 'lense' } },
          { type: { _eq: 'category' } },
        ],
      },
    })
  })
}

export async function tagGetAllCuisinesWithDishes(
  batch_size: number,
  page: number
) {
  return await resolvedWithFields(
    () => {
      const r = query.tag({
        where: {
          parent: {
            type: { _eq: 'country' },
          },
        },
        limit: batch_size,
        offset: page * batch_size,
        order_by: [
          {
            name: order_by.asc,
          },
        ],
      })

      return r
    },
    (t: tag[]) => {
      return t.map((v) => {
        return {
          ...selectFields(v),
          parent: selectFields(v.parent),
          alternates: v.alternates(),
        }
      })
    }
  )
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
