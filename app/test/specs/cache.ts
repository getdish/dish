import { sleep } from '@dish/async'
import {
  Restaurant,
  RestaurantWithId,
  flushTestData,
  query,
  refetch,
  resolved,
  restaurantUpdate,
  restaurantUpsert,
  restaurant_fixture,
} from '@dish/graph'
import anyTest, { ExecutionContext, TestInterface } from 'ava'

import { redisDeletePattern, redisGet, redisSet } from '../../src/api/_redis'

interface Context {
  restaurant: Restaurant
}

const test = anyTest as TestInterface<Context>

const redis_key = 'test-graph-cache-key'
const name = 'Test Restaurant'
const old_city = 'Mars'
const new_city = 'New city'

test.beforeEach(async (t) => {
  await flushTestData()
  await redisDeletePattern(redis_key + '*')
  if (!restaurant_fixture) {
    throw new Error(`No fixture?!`)
  }
  const [restaurant] = await restaurantUpsert([
    {
      ...restaurant_fixture,
      city: old_city,
    },
  ])
  t.context.restaurant = restaurant
})

async function isOldCity(t: ExecutionContext<Context>) {
  let city: string
  city = await resolved(() => {
    const [r] = query.restaurant({ where: { name: { _eq: name } } })
    return r.city
  })
  t.is(city, old_city)
  city = await refetch(() => {
    const [r] = query.restaurant({ where: { name: { _eq: name } } })
    return r.city
  })
  t.is(city, old_city)
}

async function makeUpdate(t: ExecutionContext<Context>) {
  t.context.restaurant.city = new_city
  const updated = await restaurantUpdate(t.context.restaurant as RestaurantWithId)
  t.is(updated?.city ?? '', new_city)
}

async function isNewCity(t: ExecutionContext<Context>) {
  const city = await refetch(() => {
    const [r] = query.restaurant({ where: { name: { _eq: name } } })
    return r.city
  })
  t.is(city, new_city)
}

test('Using cache', async (t) => {
  await isOldCity(t)
  await makeUpdate(t)
  await isOldCity(t)
})

test('Clearing cache', async (t) => {
  await isOldCity(t)
  await makeUpdate(t)
  await fetch(process.env.APP_ENDPOINT + '/api/clearCache')
  await sleep(500)
  await isNewCity(t)
})

test('Preserving other caches', async (t) => {
  const value = 'keepme'
  await redisSet(redis_key, value)
  const response = await redisGet(redis_key)
  t.is(response, value)
  await fetch(process.env.APP_ENDPOINT + '/api/clearCache')
  await sleep(500)
  t.is(response, value)
})
