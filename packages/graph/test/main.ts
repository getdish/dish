import anyTest, { TestInterface } from 'ava'
import { resolved } from 'gqless'

import { query } from '../src'

// to run against prod do:
// HASURA_ENDPOINT=https://hasura.rio.dishapp.com yarn tst

interface Context {}
const test = anyTest as TestInterface<Context>

test('jsob-query', async (t) => {
  const tags = ['Vietnamese']

  const country_tags = await resolved(() => {
    const _country_tags = query.tag({
      where: {
        _or: [{ name: { _in: tags } }, { alternates: { _has_keys_any: tags } }],
        type: { _eq: 'country' },
      },
    })
    return _country_tags.map((tag) => {
      const alternates = tag.alternates?.() ?? ['']
      console.log('alternates are', alternates)
      return {
        id: tag.id,
        name: tag.name,
        alternates: alternates[0],
      }
    })
  })

  console.log('tags are', country_tags)
  t.is(1, 1)
})
