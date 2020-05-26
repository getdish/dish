import './_debug'

import anyTest, { TestInterface } from 'ava'

import {
  Auth,
  Restaurant,
  Tag,
  User,
  flushTestData,
  restaurantUpsert,
  reviewFindAllForRestaurant,
  reviewInsert,
  tagInsert,
  userUpsert,
} from '../src'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  restaurant: Restaurant
  existing_tag: Tag
  user: User
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await restaurantUpsert([restaurant_fixture])
  t.context.restaurant = restaurant
  const [existing_tag] = await tagInsert([{ name: 'Test tag existing' }])
  t.context.existing_tag = existing_tag
  await Auth.login('test', 'password')
  const [user] = await userUpsert([
    {
      username: 'test',
      password: 'password',
    },
  ])
  t.context.user = user
})

test.skip('Add a review for the whole restaurant itself', async (t) => {
  console.log('what is', t.context.restaurant.id)
  const [review] = await reviewInsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      rating: 5,
      text: 'test',
    },
  ])
  const results = await reviewFindAllForRestaurant(t.context.restaurant.id)
  console.log('got', { review, results })
  t.deepEqual(review.id, results[0].id)
})

test.skip('Add a review for restaurant by tag', async (t) => {
  const [review] = await reviewInsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      tag_id: t.context.existing_tag.id,
      rating: 5,
      text: 'test',
    },
  ])
  const results = await reviewFindAllForRestaurant(t.context.restaurant.id)
  console.log('got', review, results)
  t.deepEqual(review.id, results[0].id)
})
