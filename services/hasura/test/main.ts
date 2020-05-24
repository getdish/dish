import {
  Auth,
  Dish,
  Restaurant,
  Scrape,
  User,
  deleteAllBy,
  deleteAllFuzzyBy,
  findOne,
  insert,
  update,
} from '@dish/graph'
import {
  restaurantFindOne,
  restaurantInsert,
  restaurantUpsert,
  scrapeFindOne,
} from '@dish/graph/src'
import anyTest, { TestInterface } from 'ava'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  Auth.as('admin')
  await deleteAllFuzzyBy('user', 'username', 'test')
  await deleteAllFuzzyBy('restaurant', 'name', 'test')
})

test('Normal user cannot delete things', async (t) => {
  await Auth.register('tester', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
  try {
    await deleteAllBy('restaurant', 'id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_restaurant" not found in type: \'mutation_root\''
    )
  }
  try {
    await deleteAllBy('user', 'id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_user" not found in type: \'mutation_root\''
    )
  }
  try {
    await deleteAllBy('dish', 'id', 'example')
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "delete_dish" not found in type: \'mutation_root\''
    )
  }
  try {
    await deleteAllBy('scrape', 'id', 'example')
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
    const scrape = await scrapeFindOne({ id: 'example' })
  } catch (e) {
    t.is(
      e.errors[0].message,
      'field "scrape" not found in type: \'query_root\''
    )
  }
})

test('Normal user can see restaurants', async (t) => {
  await insert<Restaurant>('restaurant', [
    {
      name: 'test',
      location: {
        type: 'Point',
        coordinates: [50, 0],
      },
    },
  ])
  await Auth.register('tester', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
  const restaurant = await restaurantFindOne({ name: 'test' })
  t.is(restaurant.name, 'test')
})

test('Contributor can edit restaurants', async (t) => {
  await Auth.register('tester-contributor', 'password')
  let user = await findOne<User>('user', { username: 'tester-contributor' })
  user = await update<User>('user', {
    ...user,
    role: 'contributor',
  })
  let [restaurant] = await restaurantInsert([
    {
      name: 'test',
      location: {
        type: 'Point',
        coordinates: [50, 0],
      },
    },
  ])
  await Auth.login('tester-contributor', 'password')
  Auth.as('user')
  restaurant.rating = 5
  await restaurantUpsert([restaurant])
  restaurant = await restaurantFindOne({ name: 'test' })
  t.is(restaurant.rating, 5)
})
