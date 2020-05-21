import { restaurantSaveCanonical } from '@dish/graph'
import anyTest, { TestInterface } from 'ava'
import moment from 'moment'

import { dish_fixture, restaurant_fixture } from './etc/fixtures'

interface Context {
  restaurant: Restaurant
  existing_tag: Tag
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  let restaurant = new Restaurant(restaurant_fixture)
  await restaurant.upsert()
  t.context.restaurant = restaurant
})

test('Inserting a restaurant', async (t) => {
  t.assert(t.context.restaurant.id != undefined)
  t.is(t.context.restaurant.name, 'Test Restaurant')
})

test('Upserting a restaurant', async (t) => {
  const restaurant = new Restaurant({
    ...restaurant_fixture,
    description: 'Upserted',
  })
  await restaurant.upsert()
  t.is(restaurant.description, 'Upserted')
})

test('Upserting a dish', async (t) => {
  dish_fixture['restaurant_id'] = t.context.restaurant.id
  const dish = new Dish(dish_fixture)
  await dish.upsert()
  t.assert(dish.id != undefined)
  t.is(dish.name, 'Test Dish')
})

test('Finding a restaurant by name', async (t) => {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', 'Test Restaurant')
  t.is(restaurant.name, 'Test Restaurant')
})

test('Finding a restaurant by location', async (t) => {
  const restaurants = await Restaurant.findNear(50, 0, 0.025)
  t.is(restaurants[0].name, 'Test Restaurant')
})

test('Inserts a new canonical restaurant', async (t) => {
  const canonical = await restaurantSaveCanonical(
    1,
    51,
    'Test Restaurant',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.is(restaurant.address, '123 The Street')
})

test('Identifies a canonical restaurant', async (t) => {
  const canonical = await restaurantSaveCanonical(
    0,
    50,
    'Test Restaurant',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.deepEqual(restaurant.id, t.context.restaurant.id)
})

test('Identifies a similar restaurant', async (t) => {
  const canonical = await restaurantSaveCanonical(
    0.00025,
    50,
    'Test Restaurant!',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.deepEqual(restaurant.id, t.context.restaurant.id)
})

test.skip('Is open now', async (t) => {
  const url = 'http://worldtimeapi.org/api/timezone/America/Los_Angeles'
  const now_string = await fetch(url).then((res) => res.json())
  const now = moment(now_string.datetime)
  const tz_offset = now_string.utc_offset
  const today = now.format('YYYY-MM-DD')
  const open = moment(`${today}T11:00:00${tz_offset}`)
  const close = moment(`${today}T20:30:00${tz_offset}`)
  const is_open = now.isBetween(open, close)
  const restaurant = new Restaurant()
  await restaurant.findOne('name', 'Test Restaurant')
  t.is(restaurant.is_open_now, is_open)
})
