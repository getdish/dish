import { upsert } from '../helpers'
import { tagTagUpsert } from '../helpers/tag_tag'
import { query, resolved } from '../index'
import { Tag, TagTag } from '../types'

export async function tagUpsert(objects: Tag[]) {
  return await upsert<Tag>('tag_tag', 'tag_parentId_name_key', objects)
}

export async function tagGetAllChildren(parents: Pick<Tag, 'id'>[]) {
  return await resolved(() => {
    return query.tag({
      where: {
        parentId: {
          _in: parents,
        },
      },
    })
  })
}

export async function tagFindCountries(countries: string[]) {
  return await resolved(() => {
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
  const objects = category_tag_ids.map((category_tag_id) => {
    return {
      category_tag_id,
      tag_id: tag.id,
    } as TagTag
  })
  return await tagTagUpsert(objects)
}
