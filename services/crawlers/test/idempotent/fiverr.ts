import { findOneByHash, flushTestData } from '@dish/graph'
import anyTest, { TestInterface } from 'ava'

import { ParseFiverr } from '../../src/wikipedia/ParseFiverr'

interface Context {
  restaurant: Tag
}

const test = anyTest as TestInterface<Context>
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

test.beforeEach(async (t) => {
  await flushTestData()
  await Tag.upsertOne({
    name: 'Test Asian',
    type: 'continent',
  })
})

test('Parsing Fiverr text files', async (t) => {
  await ParseFiverr.start(__dirname)

  const continent_tag = await findOneByHash('tag', {
    name: 'Test Asian',
  })
  t.is(continent_tag.type, 'continent')

  const country_tag = await findOneByHash('tag', {
    name: 'Test Pakistani',
  })
  t.is(country_tag.type, 'country')
  t.is(country_tag.parentId, continent_tag.id)

  const vegetarian_tag = await findOneByHash('tag', {
    name: 'Test Vegetarian',
  })
  t.is(vegetarian_tag.type, 'category')
  t.is(vegetarian_tag.parentId, country_tag.id)

  const diacritics_tag = await findOneByHash('tag', {
    name: 'Test Diacritics',
  })
  t.is(diacritics_tag.type, 'category')
  t.is(diacritics_tag.parentId, country_tag.id)

  const khichdi_dish_tag = await findOneByHash('tag', {
    name: 'Test Khichdi',
  })
  t.is(khichdi_dish_tag.type, 'dish')
  t.is(khichdi_dish_tag.parentId, country_tag.id)
  t.truthy(
    khichdi_dish_tag.categories
      .map((i) => i.category.name)
      .includes('Test Vegetarian')
  )

  const diakritik_dish_tag = findOneByHash('tag', { name: 'test diakritikos' })
  t.is(diakritik_dish_tag.type, 'dish')
  t.deepEqual(diakritik_dish_tag.alternates, ['test diakritikós'])
  t.is(diakritik_dish_tag.parentId, country_tag.id)
  t.truthy(
    diakritik_dish_tag.categories
      .map((i) => i.category.name)
      .includes('Test Diacritics')
  )
})
