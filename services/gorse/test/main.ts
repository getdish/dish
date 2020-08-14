import { sleep } from '@dish/async'
import {
  Auth,
  Restaurant,
  User,
  flushTestData,
  restaurantUpsert,
  reviewUpsert,
} from '@dish/graph'
import anyTest, { TestInterface } from 'ava'
import fetch from 'node-fetch'

interface Context {
  restaurant: Restaurant
  user: User
}

const test = anyTest as TestInterface<Context>

const GORSE_ENDPOINT = 'http://localhost:9000'

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await restaurantUpsert([
    {
      name: 'Test Restaurant',
      location: {
        type: 'Point',
        coordinates: [0, 50],
      },
      address: 'No 1 Non-existent Street',
    },
  ])
  t.context.restaurant = restaurant
  await Auth.register('test', 'password')
  const [_, user] = await Auth.login('test', 'password')
  t.context.user = user
})

test('Adds and updates Gorse feedback', async (t) => {
  await reviewUpsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      rating: 5,
      text: 'test',
    },
  ])
  await sleep(1000)
  let response = await fetch(
    GORSE_ENDPOINT + `/user/${t.context.user.username}/feedback`
  )
  let history = await response.json()
  let candidate = history.find((i) => i.ItemId == t.context.restaurant.id)
  t.deepEqual(candidate, {
    UserId: t.context.user.username,
    ItemId: t.context.restaurant.id,
    Rating: 5,
  })
  await reviewUpsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      rating: 4,
      text: 'test',
    },
  ])
  await sleep(1000)
  response = await fetch(
    GORSE_ENDPOINT + `/user/${t.context.user.username}/feedback`
  )
  history = await response.json()
  candidate = history.find((i) => i.ItemId == t.context.restaurant.id)
  t.deepEqual(candidate, {
    UserId: t.context.user.username,
    ItemId: t.context.restaurant.id,
    Rating: 4,
  })
})
