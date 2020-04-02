import auth from '@dish/auth'
import anyTest, { TestInterface } from 'ava'
import axios from 'axios'
import moment from 'moment'

import { Dish } from '../src/Dish'
import { Restaurant } from '../src/Restaurant'
import { Review } from '../src/Review'
import { Taxonomy } from '../src/Taxonomy'
import { User } from '../src/User'
import { flushTestData } from '../src/utils'

interface Context {
  restaurant: Restaurant
  existing_tag: Taxonomy
  user: User
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
  hours: [
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
    { hoursInfo: { hours: ['11:00 am - 8:30 pm'] } },
  ],
}

const dish_fixture: Partial<Dish> = {
  name: 'Test Dish',
  description: 'Not a real dish :(',
  price: 123,
  image: 'https://imgur.com/123abc',
}

test.beforeEach(async (t) => {
  await flushTestData()
  let restaurant = new Restaurant(restaurant_fixture)
  await restaurant.upsert()
  t.context.restaurant = restaurant
  const existing_tag = new Taxonomy({ name: 'test_tag_existing' })
  await existing_tag.insert()
  t.context.existing_tag = existing_tag
  await auth.register('test', 'password')
  const user = new User()
  await user.findOne('username', 'test')
  t.context.user = user
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

test('Tagging a restaurant', async (t) => {
  const restaurant = new Restaurant({
    ...restaurant_fixture,
  })
  await restaurant.upsert()
  const tag_ids = await restaurant.upsertTags(['test_tag', 'test_tag_existing'])
  await restaurant.findOne('name', restaurant.name)
  t.is(tag_ids.length, 2)
  t.is(tag_ids.includes(t.context.existing_tag.id), true)
  t.is(restaurant.tags.map((t) => t.taxonomy.name).includes('test_tag'), true)
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
  const tag = new Taxonomy({ name: 'test_tag' })
  await tag.insert()
  await restaurant.upsertTags(['test_tag'])
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
    tags: ['test_tag'],
  })
  t.is(results[0].tags[0].taxonomy.name, 'test_tag')
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

test('Identifies a canonical restaurant', async (t) => {
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

test('Identifies a similar restaurant', async (t) => {
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

test.skip('Is open now', async (t) => {
  const url = 'http://worldtimeapi.org/api/timezone/America/Los_Angeles'
  const now_string = await axios.get(url)
  const now = moment(now_string.data.datetime)
  const tz_offset = now_string.data.utc_offset
  const today = now.format('YYYY-MM-DD')
  const open = moment(`${today}T11:00:00${tz_offset}`)
  const close = moment(`${today}T20:30:00${tz_offset}`)
  const is_open = now.isBetween(open, close)
  const restaurant = new Restaurant()
  await restaurant.findOne('name', 'Test Restaurant')
  t.is(restaurant.is_open_now, is_open)
})

test('Add a review for the whole restaurant itself', async (t) => {
  const review = new Review({
    restaurant_id: t.context.restaurant.id,
    user_id: t.context.user.id,
    rating: 5,
    text: 'test',
  })
  await review.insert()
  const results = await Review.findAllForRestaurant(t.context.restaurant.id)
  t.deepEqual(review.id, results[0].id)
})

test('Add a review for restaurant by tag', async (t) => {
  const review = new Review({
    restaurant_id: t.context.restaurant.id,
    user_id: t.context.user.id,
    taxonomy_id: t.context.existing_tag.id,
    rating: 5,
    text: 'test',
  })
  await review.insert()
  const results = await Review.findAllForRestaurant(t.context.restaurant.id)
  t.deepEqual(review.id, results[0].id)
})
