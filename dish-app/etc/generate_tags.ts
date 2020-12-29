import { join } from 'path'

import { order_by, query, resolved, startLogging } from '@dish/graph'
import { writeFile, writeJSON } from 'fs-extra'
import { sortBy } from 'lodash'

import { getFullTag } from '../src/app/state/getFullTag'

startLogging()
main()

async function main() {
  const tags = await getAllTags()
  let output = ''
  for (const key in tags) {
    output += `export const ${key} = ${JSON.stringify(tags[key], null, 2)}\n`
  }
  await writeFile(
    join(__dirname, '..', 'src', 'constants', 'localTags.ts'),
    output
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
      'Banh mi',
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
      const exact = query.tag({
        where: {
          name: {
            _eq: name,
          },
          icon: {
            _neq: '',
          },
        },
        limit: 1,
        order_by: [{ popularity: order_by.desc }],
      })[0]
      const fuzzy = query.tag({
        where: {
          name: {
            _ilike: `%${name}%`,
          },
          icon: {
            _neq: '',
          },
        },
        limit: 1,
        order_by: [{ popularity: order_by.desc }],
      })[0]
      return getFullTag(exact || fuzzy)
    })
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
