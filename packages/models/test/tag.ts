import anyTest, { TestInterface } from 'ava'

import { flushTestData } from '../src/flushTestData'
import { Restaurant } from '../src/Restaurant'
import { Tag } from '../src/Tag'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  existing_tag: Tag
  restaurant: Restaurant
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const restaurant = new Restaurant({
    ...restaurant_fixture,
  })
  await restaurant.upsert()
  t.context.restaurant = restaurant
  const existing_tag = new Tag({ name: 'Test tag existing' })
  await existing_tag.insert()
  t.context.existing_tag = existing_tag
})

test('Tagging a restaurant with orphaned tags', async (t) => {
  const restaurant = t.context.restaurant
  await restaurant.upsertTags([
    { name: 'Test tag' },
    { name: 'Test tag existing' },
  ])
  await restaurant.findOne('name', restaurant.name)
  t.is(restaurant.tags.length, 2)
  t.is(
    restaurant.tags.map((t) => t.tag.id).includes(t.context.existing_tag.id),
    true
  )
  t.is(restaurant.tags.map((t) => t.tag.name).includes('Test tag'), true)
  t.is(restaurant.tags.map((t) => t.tag.displayName).includes('Test tag'), true)
  t.is(restaurant.tag_names.length, 2)
  t.is(restaurant.tag_names.includes('test-tag'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
})

test('Tagging a restaurant with a tag that has a parent', async (t) => {
  const restaurant = t.context.restaurant
  await restaurant.upsertTags([
    { name: 'Test tag', parentId: t.context.existing_tag.id },
  ])
  await restaurant.findOne('name', restaurant.name)
  t.is(restaurant.tags.length, 1)
  t.is(restaurant.tags.map((t) => t.tag.name).includes('Test tag'), true)
  t.is(restaurant.tag_names.length, 3)
  t.is(restaurant.tag_names.includes('test-tag'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing__test-tag'), true)
})

test('Tagging a restaurant with a tag that has categories', async (t) => {
  const tag_name = 'Test tag with category'
  const tag_with_category = new Tag({ name: tag_name })
  await tag_with_category.insert()
  await tag_with_category.upsertCategorizations([t.context.existing_tag.id])
  const restaurant = t.context.restaurant
  await restaurant.upsertTags([{ name: tag_name }])
  await restaurant.findOne('name', restaurant.name)
  t.is(restaurant.tags.length, 1)
  t.is(restaurant.tags.map((t) => t.tag.name).includes(tag_name), true)
  t.is(restaurant.tag_names.length, 2)
  t.is(restaurant.tag_names.includes('test-tag-with-category'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
})

test('Ambiguous tags get marked', async (t) => {
  const tag_name = 'Test tag'
  let tag1 = new Tag({ name: tag_name, parentId: t.context.existing_tag.id })
  await tag1.insert()
  await tag1.findOne('id', tag1.id)
  t.is(tag1.is_ambiguous, false)

  let tag2 = new Tag({ name: tag_name })
  await tag2.insert()
  await tag1.findOne('id', tag1.id)
  await tag2.findOne('id', tag2.id)
  t.is(tag1.is_ambiguous, true)
  t.is(tag2.is_ambiguous, true)
})
