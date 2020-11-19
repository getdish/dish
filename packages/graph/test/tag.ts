import anyTest, { TestInterface } from 'ava'

import {
  RestaurantTag,
  RestaurantWithId,
  TagWithId,
  flushTestData,
  query,
  resolved,
  restaurantFindOneWithTags,
  restaurantUpsert,
  restaurantUpsertOrphanTags,
  restaurantUpsertRestaurantTags,
  tagFindOne,
  tagInsert,
  tagUpsert,
  tagUpsertCategorizations,
} from '../src'
import { query } from '../src/graphql/new-generated'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  existing_tag: TagWithId
  restaurant: RestaurantWithId
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await restaurantUpsert([restaurant_fixture])
  t.context.restaurant = restaurant
  const [existing_tag] = await tagUpsert([{ name: 'Test tag existing' }])
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

test('Getting top tags for a restaurant', async (t) => {
  let restaurant = await restaurantFindOneWithTags({
    name: 'Test Restaurant',
  })
  const [t1, t2, t3] = await tagInsert([
    { name: 'Test tag 1', type: 'dish', parentId: t.context.existing_tag.id },
    {
      name: 'Test tag 2',
      type: 'dish',
      parentId: t.context.existing_tag.id,
    },
    { name: 'Test tag 3', type: 'dish', parentId: t.context.existing_tag.id },
  ])
  restaurant = (await restaurantUpsertRestaurantTags(restaurant, [
    { tag_id: t1.id },
    { tag_id: t2.id },
    { tag_id: t3.id },
  ]))!
  const r = await resolved(() => {
    const restaurant_query = query.restaurant({
      where: {
        slug: {
          _eq: restaurant.slug,
        },
      },
      limit: 1,
    })
    const results = restaurant_query[0].top_tags({
      args: {
        tag_names: 'test-tag-existing__test-tag-2',
        _tag_types: 'dish',
      },
      limit: 5,
    })
    return results.map((r) => {
      return {
        slug: r.tag.slug,
      }
    })
  })
  t.deepEqual(r, [
    { slug: 'test-tag-existing__test-tag-2' },
    { slug: 'test-tag-existing__test-tag-1' },
    { slug: 'test-tag-existing__test-tag-3' },
  ])
})
