import '@dish/helpers/polyfill'

import {
  Auth,
  Restaurant,
  UserWithId,
  ZeroUUID,
  deleteAllBy,
  deleteAllFuzzyBy,
  mutation,
  query,
  resolved,
  resolvedMutation,
  restaurantInsert,
  userFindOne,
  userUpdate,
} from '@dish/graph'
import anyTest, { TestInterface } from 'ava'

interface Context {}

const test = anyTest as TestInterface<Context>

const getRestaurantSimple = async (rname: string) => {
  return await resolved(
    () => {
      const [result] =
        query.restaurant({
          where: { name: { _eq: rname } },
          limit: 1,
        }) ?? []
      if (result) {
        const { id, name, address, rating } = result
        return {
          id,
          name,
          address,
          rating,
        }
      }
      return null
    },
    {
      noCache: true,
    }
  )
}

const updateRestaurantSimple = async (restaurant: Restaurant) => {
  for (const key of Object.keys(restaurant)) {
    if (restaurant[key] == null) delete restaurant[key]
  }
  return await resolvedMutation(() => {
    const m = mutation.update_restaurant({
      where: { id: { _eq: restaurant.id } },
      _set: restaurant,
    })

    return m?.affected_rows
  })
}

test.beforeEach(async () => {
  Auth.as('admin')
  await deleteAllFuzzyBy('user', 'username', 'test')
  await deleteAllFuzzyBy('restaurant', 'name', 'test')
})

test.skip('Normal user cannot delete things', async (t) => {
  let error: Error
  await Auth.register('tester', 'test@test.com', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')

  error = await t.throwsAsync(() => deleteAllBy('restaurant', 'id', ZeroUUID))
  t.assert(error.message.includes('field "delete_restaurant" not found in type: \'mutation_root\''))

  error = await t.throwsAsync(() => deleteAllBy('user', 'id', ZeroUUID))
  t.assert(error.message.includes('field "delete_user" not found in type: \'mutation_root\''))

  error = await t.throwsAsync(() => deleteAllBy('menu_item', 'id', ZeroUUID))
  t.assert(error.message.includes('field "delete_menu_item" not found in type: \'mutation_root\''))
})

test('Normal user can see restaurants', async (t) => {
  await restaurantInsert([
    {
      name: 'test',
      location: {
        type: 'Point',
        coordinates: [50, 0],
      },
    },
  ])
  await Auth.register('tester', 'test@test.com', 'password')
  await Auth.login('tester', 'password')
  Auth.as('user')
  const restaurant = await getRestaurantSimple('test')
  t.is(restaurant.name, 'test')
})

test('Contributor can edit restaurants', async (t) => {
  let [restaurant] = await restaurantInsert([
    {
      name: 'test',
      location: {
        type: 'Point',
        coordinates: [50, 0],
      },
    },
  ])
  await Auth.register('tester-contributor', 'test@test.com', 'password')
  let user = await userFindOne({ username: 'tester-contributor' })
  user = await userUpdate({
    ...user,
    role: 'contributor',
  } as UserWithId)
  await Auth.login('tester-contributor', 'password')
  Auth.as('user')
  restaurant.rating = 5
  await updateRestaurantSimple(restaurant)
  const r2 = await getRestaurantSimple('test')
  t.is(r2.rating, 5)
})
