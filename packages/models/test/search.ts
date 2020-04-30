import test from 'ava'

import { flushTestData } from '../src/flushTestData'
import { Restaurant } from '../src/Restaurant'
import { restaurant_fixture } from './etc/fixtures'

test.beforeEach(async (t) => {
  await flushTestData()
})

test('Searching for a restaurant by name', async (t) => {
  const restaurant = new Restaurant({
    ...restaurant_fixture,
  })
  await restaurant.upsert()

  const results = await Restaurant.search({
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
  t.is(results[0].name, 'Test Restaurant')
})

test('Searching for a restaurant by tag', async (t) => {
  const restaurant = new Restaurant({
    ...restaurant_fixture,
  })
  await restaurant.upsert()
  await restaurant.upsertOrphanTags(['Test tag'])
  const results = await Restaurant.search({
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
  t.is(results[0].tags[0].tag.name, 'Test tag')
})
