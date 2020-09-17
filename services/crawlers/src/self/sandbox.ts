import {
  RestaurantWithId,
  findOne,
  restaurantFindOneWithTags,
} from '@dish/graph'

import { DB } from '../utils'
import { Self } from './Self'

async function one() {
  let restaurant = await findOne<RestaurantWithId>('restaurant', {
    slug: process.env.SLUG || '',
  })
  if (restaurant) {
    const merger = new Self()
    await merger.mergeAll(restaurant.id)
    //restaurant = await restaurantFindOneWithTags(restaurant)
    //console.log(JSON.stringify(restaurant?.tags, null, 4))
  }
}

async function all() {
  const internal = new Self()
  await internal.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function query() {
  const internal = new Self()
  if (!process.env.QUERY) return
  const main_db = DB.main_db()
  const result = await main_db.query(process.env.QUERY)
  for (const row of result.rows) {
    await internal.runOnWorker('mergeAll', [row.id])
  }
}

if (process.env.SLUG) {
  one()
}

if (process.env.ALL == '1') {
  all()
}

if (process.env.QUERY) {
  query()
}
