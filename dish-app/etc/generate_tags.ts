import { join } from 'path'

import { order_by, query, resolved } from '@dish/graph'
import { writeJSON } from 'fs-extra'
import { sortBy } from 'lodash'

import { getFullTag } from '../shared/state/getFullTags'

main()

async function main() {
  const tags = await getAllTags()
  await writeJSON(
    join(__dirname, '..', 'shared', 'state', 'localTags.json'),
    tags,
    {
      spaces: 2,
    }
  )
  console.log('wrote tags', tags)
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
      .map(getFullTag)
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
      return getFullTag(
        query.tag({
          where: {
            name: {
              _ilike: `%${name}%`,
            },
          },
          limit: 1,
          order_by: [{ popularity: order_by.desc }],
        })[0]
      )
    })

    return
  })

  const tagLensesAll = await resolved(() => {
    return query
      .tag({
        where: {
          type: {
            _eq: 'lense',
          },
        },
      })
      .map(getFullTag)
  })

  const tagLenses = sortBy(
    tagLensesAll.filter((x) => !!x.icon),
    (x) => {
      return x.name === 'Gems' ? 0 : 1
    }
  )

  return {
    tagDefaultAutocomplete,
    tagLenses,
    tagFilters,
  }
}
