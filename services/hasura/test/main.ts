import anyTest, { TestInterface } from 'ava'

import auth from '@dish/auth'
import { Restaurant, User, Dish, Scrape } from '@dish/models'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  auth.as('admin')
  await User.deleteAllFuzzyBy('username', 'test')
  await Restaurant.deleteAllFuzzyBy('name', 'test')
})

test('Normal user cannot delete things', async t => {
  await auth.register('tester', 'password')
  await auth.login('tester', 'password')
  auth.as('user')
  try {
    await Restaurant.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(e.errors[0].message, 'no mutations exist')
  }
  try {
    await User.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(e.errors[0].message, 'no mutations exist')
  }
  try {
    await Dish.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(e.errors[0].message, 'no mutations exist')
  }
  try {
    await Scrape.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(e.errors[0].message, 'no mutations exist')
  }
})

test('Normal user cannot get scrapes', async t => {
  await auth.register('tester', 'password')
  await auth.login('tester', 'password')
  auth.as('user')
  try {
    const scrape = new Scrape()
    await scrape.findOne('id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "scrape" not found in type: \'query_root\''
    )
  }
})

test('Normal user can see restaurants', async t => {
  const restaurant = new Restaurant({
    name: 'test',
    location: {
      type: 'Point',
      coordinates: [50, 0],
    },
  })
  await restaurant.insert()
  await auth.register('tester', 'password')
  await auth.login('tester', 'password')
  auth.as('user')
  await restaurant.findOne('name', 'test')
  t.is(restaurant.name, 'test')
})

test('Contributor can edit restaurants', async t => {
  await auth.register('tester-contributor', 'password')
  const user = new User()
  await user.findOne('username', 'tester-contributor')
  user.role = 'contributor'
  await user.update()
  const restaurant = new Restaurant({
    name: 'test',
    location: {
      type: 'Point',
      coordinates: [50, 0],
    },
  })
  await restaurant.insert()
  await auth.login('tester-contributor', 'password')
  auth.as('user')
  restaurant.rating = 5
  await restaurant.update()
  await restaurant.findOne('name', 'test')
  t.is(restaurant.rating, 5)
})
