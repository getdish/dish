import auth from '@dish/auth'
import anyTest, { TestInterface } from 'ava'

import { flushTestData } from '../src/flushTestData'
import { Restaurant } from '../src/Restaurant'
import { Review } from '../src/Review'
import { Tag } from '../src/Tag'
import { User } from '../src/User'
import { restaurant_fixture } from './etc/fixtures'

interface Context {
  restaurant: Restaurant
  existing_tag: Tag
  user: User
}

const test = anyTest as TestInterface<Context>

test.beforeEach(async (t) => {
  await flushTestData()
  let restaurant = new Restaurant(restaurant_fixture)
  await restaurant.upsert()
  t.context.restaurant = restaurant
  const existing_tag = new Tag({ name: 'Test tag existing' })
  await existing_tag.insert()
  t.context.existing_tag = existing_tag
  await auth.register('test', 'password')
  const user = new User()
  await user.findOne('username', 'test')
  t.context.user = user
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
    tag_id: t.context.existing_tag.id,
    rating: 5,
    text: 'test',
  })
  await review.insert()
  const results = await Review.findAllForRestaurant(t.context.restaurant.id)
  t.deepEqual(review.id, results[0].id)
})
