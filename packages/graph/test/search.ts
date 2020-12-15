import '@dish/react-test-env'

import anyTest, { TestInterface } from 'ava'
import { clone } from 'lodash'

import {
  Auth,
  SEARCH_DOMAIN,
  User,
  flushTestData,
  restaurantUpsert,
  restaurantUpsertOrphanTags,
  restaurantUpsertRestaurantTags,
  reviewUpsert,
  search,
  tagInsert,
} from '../src'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  user: User
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  await Auth.register('test', 'test@test.com', 'password')
  const [_, user] = await Auth.login('test', 'password')
  t.context.user = user
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
  t.is(results.name_matches[0].id, restaurant.id)
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
  t.is(results?.restaurants?.[0].id, restaurant.id)
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
  const result = await search({
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
  const results = result.name_matches
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

  t.is(results?.restaurants.length, 3)
  t.is(results?.restaurants?.[0].id, rr3.id)
  t.is(results?.restaurants?.[0].meta.restaurant_rank, 3)
  t.is(results?.restaurants?.[0].meta.rish_rank, 1)
  t.is(results?.restaurants?.[1].id, rr1.id)
  t.is(results?.restaurants?.[1].meta.restaurant_rank, 1)
  t.is(results?.restaurants?.[1].meta.rish_rank, 2)
  t.is(results?.restaurants?.[2].id, rr2.id)
  t.is(results?.restaurants?.[2].meta.restaurant_rank, 2)
  t.is(results?.restaurants?.[2].meta.rish_rank, 3)
})

test('Supports main_tag priority ordering', async (t) => {
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
  const [lesser_tag] = await tagInsert([
    { name: 'Test rated tag', type: 'dish' },
  ])
  await restaurantUpsertRestaurantTags(rr1, [
    { tag_id: lesser_tag.id, score: 3 },
  ])
  await restaurantUpsertRestaurantTags(rr2, [
    { tag_id: lesser_tag.id, score: 1 },
  ])
  await restaurantUpsertRestaurantTags(rr3, [
    { tag_id: lesser_tag.id, score: 5 },
  ])
  const [main_tag] = await tagInsert([{ name: 'Test main tag', type: 'dish' }])
  await restaurantUpsertRestaurantTags(rr1, [{ tag_id: main_tag.id, score: 3 }])
  await restaurantUpsertRestaurantTags(rr2, [{ tag_id: main_tag.id, score: 5 }])
  await restaurantUpsertRestaurantTags(rr3, [{ tag_id: main_tag.id, score: 1 }])
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
    tags: ['global__test-rated-tag'],
    main_tag: 'global__test-main-tag',
  })
  t.is(results?.restaurants?.length, 3)
  t.is(results?.restaurants?.[0].id, rr2.id)
  t.is(results?.restaurants?.[0].meta.main_tag_rank, 1)
  t.is(results?.restaurants?.[0].meta.restaurant_rank, 2)
  t.is(results?.restaurants?.[1].id, rr1.id)
  t.is(results?.restaurants?.[1].meta.main_tag_rank, 2)
  t.is(results?.restaurants?.[1].meta.restaurant_rank, 1)
  t.is(results?.restaurants?.[2].id, rr3.id)
  t.is(results?.restaurants?.[2].meta.main_tag_rank, 3)
  t.is(results?.restaurants?.[2].meta.restaurant_rank, 3)
})

test('Home page feed', async (t) => {
  restaurant_fixture.location = {
    type: 'Point',
    coordinates: [-122, 36],
  }
  let [restaurant] = await restaurantUpsert([restaurant_fixture])
  await reviewUpsert([
    {
      user_id: t.context.user.id,
      restaurant_id: restaurant.id,
      text: 'test',
    },
  ])
  const response = await fetch(SEARCH_DOMAIN + '/feed')
  const json = await response.json()
  t.deepEqual(Object.keys(json), [
    'trending',
    'newest',
    'total_restaurants_in_region',
  ])
})

test('Regions', async (t) => {
  const response = await fetch(SEARCH_DOMAIN + '/regions?slug=xxx')
  const json = await response.json()
  t.deepEqual(Object.keys(json), ['bbox', 'centroid', 'name'])
})
