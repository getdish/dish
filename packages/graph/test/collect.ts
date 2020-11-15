import '@o/react-test-env'

import anyTest, { TestInterface } from 'ava'

import { restaurantFindOne } from '../_'
import { restaurant, selectFields } from '../_/graphql/new-generated'
import {
  flushTestData,
  restaurantUpsert,
  restaurantUpsertOrphanTags,
  tagFindOne,
  tagUpsert,
} from '../src'
import { restaurant_fixture } from './etc/fixtures'

interface Context {}

const test = anyTest as TestInterface<Context>

test.beforeEach(async () => {
  await flushTestData()
})

test('Collecting the root fields', async (t) => {
  const [existing_tag] = await tagUpsert([{ name: 'Test tag existing' }])
  t.assert(Object.keys(existing_tag).length > 5)
  t.is(existing_tag.name, 'Test tag existing')
  t.assert(existing_tag.parent == null)
  t.assert(existing_tag.categories == null)
})

test('Collecting a one-to-one relation', async (t) => {
  const [existing_tag] = await tagUpsert([{ name: 'Test tag existing' }])
  const tag = await tagFindOne(existing_tag)
  if (!tag) return
  t.assert(Object.keys(tag).length > 5)
  t.is(tag.name, 'Test tag existing')
  t.assert(tag.parent?.name == 'Global')
  t.assert(tag.parent?.parent == null)
  t.assert(existing_tag.categories == null)
})

test('Collecting a one-to-many relation', async (t) => {
  const [r] = await restaurantUpsert([restaurant_fixture])
  await restaurantUpsertOrphanTags(r, ['Test tag'])
  const restaurant = await restaurantFindOne(r, (rs: restaurant[]) => {
    return rs.map((r) => {
      return {
        ...selectFields(r),
        tags: r.tags().map((t) => {
          return {
            ...selectFields(t),
          }
        }),
      }
    })
  })
  t.is(restaurant!.tags.length, 1)
  t.assert(Object.keys(restaurant!.tags[0]).length > 3)
  t.is(restaurant!.tags[0].restaurant_id, restaurant!.id)
})

test('Collecting a deep relation', async (t) => {
  const [r] = await restaurantUpsert([restaurant_fixture])
  await restaurantUpsertOrphanTags(r, ['Test tag'])
  const restaurant = await restaurantFindOne(
    r,
    (rs: restaurant[]) => {
      return rs.map((r) => {
        return {
          ...selectFields(r),
          tags: r.tags().map((t) => {
            return {
              ...selectFields(t, '*', 2),
            }
          }),
        }
      })
    }
    //   {
    //   relations: ['tags.tag'],
    // }
  )
  t.is(restaurant!.tags[0].tag.name, 'Test tag')
})
