import '@dish/react-test-env'

import anyTest, { TestInterface } from 'ava'
import moment from 'moment'

import {
  Restaurant,
  RestaurantWithId,
  Tag,
  flushTestData,
  menuItemUpsert,
  restaurantFindNear,
  restaurantFindOne,
  restaurantUpdate,
  restaurantUpsert,
} from '../src'
import { menu_item_fixture, restaurant_fixture } from './etc/fixtures'

interface Context {
  restaurant: Restaurant
  existing_tag: Tag
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await restaurantUpsert([restaurant_fixture])
  t.context.restaurant = restaurant
})

test('Inserting a restaurant', async (t) => {
  t.assert(t.context.restaurant.id != undefined)
  t.is(t.context.restaurant.name, 'Test Restaurant')
})

test('Upserting a restaurant', async (t) => {
  const [restaurant] = await restaurantUpsert([
    {
      ...restaurant_fixture,
      description: 'Upserted',
    },
  ])
  t.is(restaurant.description, 'Upserted')
})

test('Upserting a dish', async (t) => {
  menu_item_fixture['restaurant_id'] = t.context.restaurant.id
  const [dish] = await menuItemUpsert([menu_item_fixture])
  t.assert(dish.id != undefined)
  t.is(dish.name, 'Test Dish')
})

test('Finding a restaurant by name', async (t) => {
  const restaurant = await restaurantFindOne({
    name: 'Test Restaurant',
  })
  t.is(restaurant?.name ?? '', 'Test Restaurant')
})

test('Avoiding cache', async (t) => {
  await restaurantFindOne({
    name: 'Test Restaurant',
  })
  t.context.restaurant.city = 'New City'

  await restaurantUpdate(t.context.restaurant as RestaurantWithId)

  const restaurant = await restaurantFindOne({
    name: 'Test Restaurant',
  })

  t.is(restaurant?.city ?? '', 'New City')
})

test('Finding a restaurant by location', async (t) => {
  const restaurants = await restaurantFindNear(50, 0, 0.025)

  t.is(restaurants[0].name, 'Test Restaurant')
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
  const restaurant = await restaurantFindOne({
    name: `Test Restaurant`,
  })
  t.is(restaurant?.is_open_now, is_open)
})
