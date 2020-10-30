import { Tag, order_by, query, resolved } from '@dish/graph'

import { FullTag } from '../shared/state/FullTag'

main()

async function main() {
  const tags = await getAllTags()
  console.log('got tags', tags)
}

async function getAllTags() {
  const tagFilters = await resolved(() => {
    return query
      .tag({
        where: {
          type: {
            _eq: 'filter',
          },
        },
      })
      .map(getTag)
  })

  const tagDefaultAutocomplete = await resolved(() => {
    const names = [
      'Pho',
      'Taco',
      'Steak',
      'Poke',
      'Dim Sum',
      'Banh Mi',
      'Pizza',
      'Boba',
      'Oysters',
      'Coffee',
      'Breakfast',
      'Curry',
      'Burger',
      'Salad',
      'Cookie',
    ]

    return names.map((name) => {
      return getTag(
        query.tag({
          where: {
            name: {
              _eq: name,
            },
          },
          limit: 1,
          order_by: [{ popularity: order_by.desc }],
        })[0]
      )
    })

    return
  })

  const tagLenses = await resolved(() => {
    return query
      .tag({
        where: {
          type: {
            _eq: 'lense',
          },
        },
      })
      .map(getTag)
  })

  return {
    tagDefaultAutocomplete,
    tagLenses,
    tagFilters,
  }
}

function getTag(tag: Tag): FullTag {
  if (!tag) {
    return null
  }
  return {
    id: tag.id,
    name: tag.name,
    type: tag.type,
    icon: tag.icon,
    rgb: tag.rgb,
    slug: tag.slug,
  }
}
