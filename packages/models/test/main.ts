import anyTest, { TestInterface } from 'ava'

import { Restaurant } from '../src/Restaurant'
import { Dish } from '../src/Dish'

interface Context {
  restaurant: Restaurant
}

const test = anyTest as TestInterface<Context>

const restaurant_fixture: Partial<Restaurant> = {
  name: 'Test Restaurant',
  description: 'Not a real restaurant :(',
  location: {
    type: 'Point',
    coordinates: [0, 50],
  },
  address: 'No 1 Non-existent Street',
  city: 'Mars',
  state: 'Denial',
  zip: 123,
  image: 'https://imgur.com/123abc',
}

const dish_fixture: Partial<Dish> = {
  name: 'Test Dish',
  description: 'Not a real dish :(',
  price: 123,
  image: 'https://imgur.com/123abc',
}

test.beforeEach(async t => {
  await Restaurant.deleteAllFuzzyBy('name', 'Test')
  await Dish.deleteAllFuzzyBy('name', 'Test')
  let restaurant = new Restaurant(restaurant_fixture)
  await restaurant.upsert()
  t.context.restaurant = restaurant
})

test('Inserting a restaurant', async t => {
  t.assert(t.context.restaurant.id != undefined)
  t.is(t.context.restaurant.name, 'Test Restaurant')
})

test('Upserting a restaurant', async t => {
  const restaurant = new Restaurant({
    ...restaurant_fixture,
    description: 'Upserted',
  })
  await restaurant.upsert()
  t.is(restaurant.description, 'Upserted')
})

test('Upserting a dish', async t => {
  dish_fixture['restaurant_id'] = t.context.restaurant.id
  const dish = new Dish(dish_fixture)
  await dish.upsert()
  t.assert(dish.id != undefined)
  t.is(dish.name, 'Test Dish')
})

test('Finding a restaurant by name', async t => {
  const restaurant = new Restaurant()
  await restaurant.findOne('name', 'Test Restaurant')
  t.is(restaurant.name, 'Test Restaurant')
})

test('Finding a restaurant by location', async t => {
  const restaurants = await Restaurant.findNear(50, 0, 0.025)
  t.is(restaurants[0].name, 'Test Restaurant')
})

test('Inserts a new canonical restaurant', async t => {
  const canonical = await Restaurant.saveCanonical(
    1,
    51,
    'Test Restaurant',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.is(restaurant.address, '123 The Street')
})

test('Identifies a canonical restaurant', async t => {
  const canonical = await Restaurant.saveCanonical(
    0,
    50,
    'Test Restaurant',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.deepEqual(restaurant.id, t.context.restaurant.id)
})

test('Identifies a similar restaurant', async t => {
  const canonical = await Restaurant.saveCanonical(
    0.00025,
    50,
    'Test Restaurant!',
    '123 The Street'
  )
  const restaurant = new Restaurant()
  await restaurant.findOne('id', canonical.id)
  t.deepEqual(restaurant.id, t.context.restaurant.id)
})
