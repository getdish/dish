import '@dish/react-test-env'

import test from 'ava'
import { clone } from 'lodash'

import {
  flushTestData,
  restaurantUpsert,
  restaurantUpsertOrphanTags,
  restaurantUpsertRestaurantTags,
  search,
  tagInsert,
} from '../src'
import { restaurant_fixture } from './etc/fixtures'

test.beforeEach(async (t) => {
  await flushTestData()
})

test('Searching for a restaurant by name', async (t) => {
  const [restaurant] = await restaurantUpsert([restaurant_fixture])
  const results = await search({
    center: {
      lat: 50.09,
      lng: 0.09,
    },
    span: {
      lat: 0.4,
      lng: 0.4,
    },
    query: 'Test',
  })
  t.is(results[0].id, restaurant.id)
})

test('Searching for a restaurant by tag', async (t) => {
  let [restaurant] = await restaurantUpsert([restaurant_fixture])
  restaurant = (await restaurantUpsertOrphanTags(restaurant, ['Test tag']))!
  const results = await search({
    center: {
      lat: 50.24,
      lng: 0.24,
    },
    span: {
      lat: 1,
      lng: 1,
    },
    query: '',
    tags: ['test-tag'],
  })
  t.is(results?.[0].id, restaurant.id)
})

test('Orders by restaurant score if no dish tags queried', async (t) => {
  let r1 = clone(restaurant_fixture)
  let r2 = clone(restaurant_fixture)
  let r3 = clone(restaurant_fixture)
  r1.name = 'test best'
  r1.score = 5
  r2.name = 'test ok'
  r2.score = 3
  r3.name = 'test worst'
  r3.score = 1
  const [rr1, rr2, rr3] = await restaurantUpsert([r1, r2, r3])
  const [tag] = await tagInsert([{ name: 'Test rated tag', type: 'dish' }])
  await restaurantUpsertRestaurantTags(rr1, [{ tag_id: tag.id, score: 3 }])
  await restaurantUpsertRestaurantTags(rr2, [{ tag_id: tag.id, score: 1 }])
  await restaurantUpsertRestaurantTags(rr3, [{ tag_id: tag.id, score: 5 }])
  const results = await search({
    center: {
      lat: 50.24,
      lng: 0.24,
    },
    span: {
      lat: 1,
      lng: 1,
    },
    query: 'test',
  })
  t.is(results?.length, 3)
  t.is(results?.[0].id, rr1.id)
  t.is(results?.[1].id, rr2.id)
  t.is(results?.[2].id, rr3.id)
})

test('Orders by restaurant+tag score if dish tags queried', async (t) => {
  let r1 = clone(restaurant_fixture)
  let r2 = clone(restaurant_fixture)
  let r3 = clone(restaurant_fixture)
  r1.name = 'test best'
  r1.score = 5
  r2.name = 'test ok'
  r2.score = 3
  r3.name = 'test worst'
  r3.score = 1
  const [rr1, rr2, rr3] = await restaurantUpsert([r1, r2, r3])
  const [tag] = await tagInsert([{ name: 'Test rated tag', type: 'dish' }])
  await restaurantUpsertRestaurantTags(rr1, [{ tag_id: tag.id, score: 3 }])
  await restaurantUpsertRestaurantTags(rr2, [{ tag_id: tag.id, score: 1 }])
  await restaurantUpsertRestaurantTags(rr3, [{ tag_id: tag.id, score: 5 }])
  const results = await search({
    center: {
      lat: 50.24,
      lng: 0.24,
    },
    span: {
      lat: 1,
      lng: 1,
    },
    query: '',
    tags: ['test-rated-tag'],
  })
  t.is(results?.length, 3)
  t.is(results?.[0].id, rr1.id)
  t.is(results?.[0].restaurant_rank, 1)
  t.is(results?.[0].rish_rank, 2)
  t.is(results?.[1].id, rr3.id)
  t.is(results?.[1].restaurant_rank, 3)
  t.is(results?.[1].rish_rank, 1)
  t.is(results?.[2].id, rr2.id)
  t.is(results?.[2].restaurant_rank, 2)
  t.is(results?.[2].rish_rank, 3)
})
