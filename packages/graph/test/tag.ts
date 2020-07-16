import anyTest, { TestInterface } from 'ava'

import {
  RestaurantWithId,
  TagWithId,
  flushTestData,
  restaurantFindOneWithTags,
  restaurantUpsert,
  restaurantUpsertOrphanTags,
  restaurantUpsertRestaurantTags,
  tagFindOne,
  tagInsert,
  tagUpsert,
  tagUpsertCategorizations,
} from '../src'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  existing_tag: TagWithId
  restaurant: RestaurantWithId
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await restaurantUpsert([restaurant_fixture])
  // @ts-ignore
  t.context.restaurant = restaurant
  const [existing_tag] = await tagUpsert([{ name: 'Test tag existing' }])
  // @ts-ignore
  t.context.existing_tag = existing_tag
})

test('Tagging a restaurant with orphaned tags', async (t) => {
  let restaurant = t.context.restaurant
  await restaurantUpsertOrphanTags(restaurant, [
    'Test tag',
    'Test tag existing',
  ])
  const next = await restaurantFindOneWithTags(restaurant)
  if (!next) {
    throw new Error(`invalid`)
  }
  restaurant = next
  t.is(restaurant.tags?.length, 2)
  t.is(
    restaurant.tags?.map((t) => t.tag.id).includes(t.context.existing_tag.id),
    true
  )
  t.is(restaurant.tags?.map((t) => t.tag.name).includes('Test tag'), true)
  t.is(
    restaurant.tags?.map((t) => t.tag.displayName).includes('Test tag'),
    true
  )
  t.is(restaurant.tag_names.length, 2)
  t.is(restaurant.tag_names.includes('test-tag'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
})

test('Tagging a restaurant with a tag that has a parent', async (t) => {
  let restaurant = t.context.restaurant
  await restaurantUpsertOrphanTags(restaurant, [
    'Test tag',
    'Test tag existing',
  ])
  const [tag] = await tagInsert([
    { name: 'Test tag', parentId: t.context.existing_tag.id },
  ])
  restaurant = (await restaurantUpsertRestaurantTags(restaurant, [
    { tag_id: tag.id },
  ]))!
  t.is(restaurant.tags?.length, 3)
  t.is(restaurant.tags?.map((t) => t.tag.name).includes('Test tag'), true)
  t.is(restaurant.tag_names.length, 3)
  t.is(restaurant.tag_names.includes('test-tag'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing__test-tag'), true)
})

test('Tagging a restaurant with a tag that has categories', async (t) => {
  const tag_name = 'Test tag with category'
  const [tag_with_category] = await tagInsert([{ name: tag_name }])
  await tagUpsertCategorizations(tag_with_category, [t.context.existing_tag.id])
  let restaurant = t.context.restaurant
  await restaurantUpsertOrphanTags(restaurant, [tag_name])
  restaurant = (await restaurantFindOneWithTags(restaurant))!

  t.is(restaurant.tags?.length, 1)
  t.is(restaurant.tags?.map((t) => t.tag?.name).includes(tag_name), true)
  t.is(restaurant.tag_names.includes('test-tag-with-category'), true)
  t.is(restaurant.tag_names.includes('test-tag-existing'), true)
  if (restaurant.tag_names.length > 2) {
    console.log(restaurant.tag_names)
  }
  t.is(restaurant.tag_names.length, 2)
})

test('Ambiguous tags get marked', async (t) => {
  const tag_name = 'Test tag'
  let [tag1] = await tagInsert([
    { name: tag_name, parentId: t.context.existing_tag.id },
  ])
  const tag2 = await tagFindOne({ id: tag1.id })
  t.is(tag2?.is_ambiguous, false)

  let [tag3] = await tagInsert([{ name: tag_name }])
  const tag4 = await tagFindOne({ id: tag1.id })
  const tag5 = await tagFindOne({ id: tag3.id })
  t.is(tag4?.is_ambiguous, true)
  t.is(tag5?.is_ambiguous, true)
})
