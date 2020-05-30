import '@dish/react-test-env'

import test from 'ava'
import { clone } from 'lodash'

import {
  RestaurantWithId,
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
  t.is(restaurant.name, 'Test Restaurant')
  t.is(results[0].name, 'Test Restaurant')
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
  t.is(results?.[0].tags?.[0].tag.name, 'Test tag')
})

test('Orders by restaurant rating if no dish tags queried', async (t) => {
  let r1 = clone(restaurant_fixture)
  let r2 = clone(restaurant_fixture)
  let r3 = clone(restaurant_fixture)
  r1.name = 'test best'
  r1.rating = 5
  r2.name = 'test ok'
  r2.rating = 3
  r3.name = 'test worst'
  r3.rating = 1
  const [rr1, rr2, rr3] = await restaurantUpsert([r1, r2, r3])
  const [tag] = await tagInsert([{ name: 'Test rated tag', type: 'dish' }])
  await restaurantUpsertRestaurantTags(rr1, [{ tag_id: tag.id, rating: 3 }])
  await restaurantUpsertRestaurantTags(rr2, [{ tag_id: tag.id, rating: 1 }])
  await restaurantUpsertRestaurantTags(rr3, [{ tag_id: tag.id, rating: 5 }])
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
  t.is(results?.[0].rating, 5)
  t.is(results?.[1].rating, 3)
  t.is(results?.[2].rating, 1)
})

test('Orders by tag rating if dish tags queried', async (t) => {
  let r1 = clone(restaurant_fixture)
  let r2 = clone(restaurant_fixture)
  let r3 = clone(restaurant_fixture)
  r1.name = 'test best'
  r1.rating = 5
  r2.name = 'test ok'
  r2.rating = 3
  r3.name = 'test worst'
  r3.rating = 1
  const [rr1, rr2, rr3] = await restaurantUpsert([r1, r2, r3])
  const [tag] = await tagInsert([{ name: 'Test rated tag', type: 'dish' }])
  await restaurantUpsertRestaurantTags(rr1, [{ tag_id: tag.id, rating: 3 }])
  await restaurantUpsertRestaurantTags(rr2, [{ tag_id: tag.id, rating: 1 }])
  await restaurantUpsertRestaurantTags(rr3, [{ tag_id: tag.id, rating: 5 }])
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
  t.is(results?.[0].tags?.[0].rating, 5)
  t.is(results?.[1].tags?.[0].rating, 3)
  t.is(results?.[2].tags?.[0].rating, 1)
})
