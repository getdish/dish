import { Auth } from '@dish/graph'
import { Dish, Restaurant, Scrape, User } from '@dish/models'
import anyTest, { TestInterface } from 'ava'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  Auth.as('admin')
  await User.deleteAllFuzzyBy('username', 'test')
  await Restaurant.deleteAllFuzzyBy('name', 'test')
})

test('Normal user cannot delete things', async (t) => {
  await Auth.register('tester', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
  try {
    await Restaurant.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_restaurant" not found in type: \'mutation_root\''
    )
  }
  try {
    await User.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_user" not found in type: \'mutation_root\''
    )
  }
  try {
    await Dish.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_dish" not found in type: \'mutation_root\''
    )
  }
  try {
    await Scrape.deleteAllBy('id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_scrape" not found in type: \'mutation_root\''
    )
  }
})

test('Normal user cannot get scrapes', async (t) => {
  await Auth.register('tester', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
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

test('Normal user can see restaurants', async (t) => {
  const restaurant = new Restaurant({
    name: 'test',
    location: {
      type: 'Point',
      coordinates: [50, 0],
    },
  })
  await restaurant.insert()
  await Auth.register('tester', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
  await restaurant.findOne('name', 'test')
  t.is(restaurant.name, 'test')
})

test('Contributor can edit restaurants', async (t) => {
  await Auth.register('tester-contributor', 'password')
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
  await Auth.login('tester-contributor', 'password')
  Auth.as('user')
  restaurant.rating = 5
  await restaurant.update()
  await restaurant.findOne('name', 'test')
  t.is(restaurant.rating, 5)
})
