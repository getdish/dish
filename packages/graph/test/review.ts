import '@dish/react-test-env'

import anyTest, { TestInterface } from 'ava'

import {
  Auth,
  Restaurant,
  Tag,
  User,
  flushTestData,
  restaurantFindOne,
  restaurantFindOneWithTags,
  restaurantTagUpsert,
  restaurantUpsert,
  reviewFindAllForRestaurant,
  reviewInsert,
  tagInsert,
  userFavoriteARestaurant,
  userFavorites,
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
  await Auth.register('test', 'test@test.com', 'password')
  const [_, user] = await Auth.login('test', 'password')
  t.context.user = user
})

test('Add a review for the whole restaurant itself', async (t) => {
  const [review] = await reviewInsert([
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
  t.deepEqual(review.id, results[0].id)
})

test('Voting triggers restaurant score change', async (t) => {
  const [review] = await reviewInsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      vote: 1,
    },
  ])
  const restaurant = await restaurantFindOne({ id: t.context.restaurant.id })
  t.deepEqual(restaurant.score, 1)
})

test('Voting triggers restaurant_tag score change', async (t) => {
  await restaurantTagUpsert(t.context.restaurant.id, [
    {
      tag_id: t.context.existing_tag.id,
      score: 10,
    },
  ])
  const [review] = await reviewInsert([
    {
      restaurant_id: t.context.restaurant.id,
      user_id: t.context.user.id,
      tag_id: t.context.existing_tag.id,
      vote: 1,
    },
  ])
  const restaurant = await restaurantFindOneWithTags({
    id: t.context.restaurant.id,
  })
  const rtag = restaurant.tags[0]
  t.deepEqual(rtag.score, 11)
})

test('Favorite a restaurant', async (t) => {
  const r1 = await userFavoriteARestaurant(
    t.context.user.id,
    t.context.restaurant.id
  )
  const f1 = await userFavorites(t.context.user.id)
  t.is(r1.id, f1[0].id)
  t.is(r1.favorited, true)

  const ru1 = await userFavoriteARestaurant(
    t.context.user.id,
    t.context.restaurant.id,
    false
  )
  t.is(r1.id, ru1.id)

  const f2 = await userFavorites(t.context.user.id)
  t.is(f2.length, 0)
})
