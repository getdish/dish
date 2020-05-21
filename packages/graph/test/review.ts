import {
  Auth,
  Restaurant,
  Review,
  Tag,
  User,
  findOne,
  flushTestData,
  insert,
  reviewFindAllForRestaurant,
  upsert,
} from '@dish/graph'
import anyTest, { TestInterface } from 'ava'

import { restaurant_fixture } from './etc/fixtures'

interface Context {
  restaurant: Restaurant
  existing_tag: Tag
  user: User
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  const [restaurant] = await upsert<Restaurant>(
    'restaurant',
    'restaurant_name_address_key',
    restaurant_fixture
  )
  t.context.restaurant = restaurant
  const existing_tag = await insert<Tag>('tag', [{ name: 'Test tag existing' }])
  t.context.existing_tag = existing_tag
  await Auth.register('test', 'password')
  const user = await findOne<User>('user', {
    username: 'username',
    password: 'test',
  })
  t.context.user = user
})

test('Add a review for the whole restaurant itself', async (t) => {
  const [review] = await insert<Review>('review', [
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      rating: 5,
      text: 'test',
    },
  ])
  const results = await reviewFindAllForRestaurant(t.context.restaurant.id)
  t.deepEqual(review.id, results[0].id)
})

test('Add a review for restaurant by tag', async (t) => {
  const [review] = await insert<Review>('review', [
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      tag_id: t.context.existing_tag.id,
      rating: 5,
      text: 'test',
    },
  ])
  const results = await reviewFindAllForRestaurant(t.context.restaurant.id)
  t.deepEqual(review.id, results[0].id)
})
