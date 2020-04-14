import { Tag, flushTestData } from '@dish/models'
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

  let continent_tag = new Tag()
  await continent_tag.findOneByHash({ name: 'Test Asian' })
  t.is(continent_tag.type, 'continent')

  let country_tag = new Tag()
  await country_tag.findOneByHash({ name: 'Test Pakistani' })
  t.is(country_tag.type, 'country')
  t.is(country_tag.parentId, continent_tag.id)

  let vegetarian_tag = new Tag()
  await vegetarian_tag.findOneByHash({ name: 'Test Vegetarian' })
  t.is(vegetarian_tag.type, 'category')
  t.is(vegetarian_tag.parentId, country_tag.id)

  let diacritics_tag = new Tag()
  await diacritics_tag.findOneByHash({ name: 'Test Diacritics' })
  t.is(diacritics_tag.type, 'category')
  t.is(diacritics_tag.parentId, country_tag.id)

  let khichdi_dish_tag = new Tag()
  await khichdi_dish_tag.findOneByHash({ name: 'Test Khichdi' })
  t.is(khichdi_dish_tag.type, 'dish')
  t.is(khichdi_dish_tag.parentId, country_tag.id)
  t.truthy(
    khichdi_dish_tag.categories
      .map((i) => i.category.name)
      .includes('Test Vegetarian')
  )

  let diakritik_dish_tag = new Tag()
  await diakritik_dish_tag.findOneByHash({ name: 'test diakritikos' })
  t.is(diakritik_dish_tag.type, 'dish')
  t.deepEqual(diakritik_dish_tag.alternates, ['test diakritikós'])
  t.is(diakritik_dish_tag.parentId, country_tag.id)
  t.truthy(
    diakritik_dish_tag.categories
      .map((i) => i.category.name)
      .includes('Test Diacritics')
  )
})
