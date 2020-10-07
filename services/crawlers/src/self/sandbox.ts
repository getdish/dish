import { RestaurantWithId, findOne, restaurantFindOne } from '@dish/graph'

import { DB } from '../utils'
import { GPT3 } from './GPT3'
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

async function gpt3() {
  let internal = new Self()
  const gpt3 = new GPT3(internal)
  let restaurant = await restaurantFindOne({ slug: process.env.GPT3 || '' })
  if (restaurant) {
    console.log('Using GPT3 ENV as restaurant slug...')
    internal.restaurant = restaurant
    internal.main_db = DB.main_db()
    await internal.generateGPT3Summary()
  } else {
    console.log('Restaurant not found, using GPT3 ENV as text to complete...')
    await gpt3.complete(process.env.GPT3 || '')
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

if (process.env.GPT3) {
  gpt3()
}

if (process.env.GPT3_TOP_100) {
  process.env.QUERY = `
    SELECT id FROM restaurant
      AND address LIKE '%Francisco%'
    ORDER BY score DESC
    LIMIT 100
  `
  query()
}
