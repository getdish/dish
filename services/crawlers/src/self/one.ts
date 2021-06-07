import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import { DB } from '../DB'
import { GPT3 } from './GPT3'
import { Self } from './Self'

export async function one(slug: string) {
  const restaurant = await restaurantFindOne({
    slug,
  })
  if (restaurant) {
    const merger = new Self()
    await merger.mergeAll(restaurant.id)
    //restaurant = await restaurantFindOneWithTags(restaurant)
    //console.log(JSON.stringify(restaurant?.tags, null, 4))
  } else {
    console.log('no restaurant found with slug', slug)
  }
}

async function all() {
  const internal = new Self()
  await internal.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function query() {
  const internal = new Self()
  if (!process.env.QUERY) return
  const result = await DB.main_db.query(process.env.QUERY)
  for (const row of result.rows) {
    await internal.runOnWorker('mergeAll', [row.id])
  }
}

async function gpt3_one() {
  let internal = new Self()
  const gpt3 = new GPT3(internal)
  let restaurant = await restaurantFindOne({ slug: process.env.GPT3 || '' })
  if (restaurant) {
    console.log('Using GPT3 ENV as restaurant slug...')
    internal.restaurant = restaurant
    internal.main_db = DB.main_db
    await internal.generateGPT3Summary(restaurant.id)
  } else {
    console.log('Restaurant not found, using GPT3 ENV as text to complete...')
    await gpt3.complete(process.env.GPT3 || '')
  }
}

async function gpt3_many(query: string) {
  const internal = new Self()
  const result = await DB.main_db.query(query)
  for (const row of result.rows) {
    await internal.runOnWorker('generateGPT3Summary', [row.id])
  }
}

async function main(slug?: string) {
  if (slug) {
    return await one(slug)
  }

  if (process.env.ALL == '1') {
    return await all()
  }

  if (process.env.QUERY) {
    return await query()
  }

  if (process.env.GPT3) {
    return await gpt3_one()
  }

  if (process.env.GPT3_TOP_100) {
    const query = `
      SELECT id FROM restaurant
        WHERE address LIKE '%Francisco%'
      ORDER BY score DESC NULLS LAST
      LIMIT 1
    `
    return await gpt3_many(query)
  }
}

if (process.env.RUN) {
  main(process.env.SLUG).then(() => {
    process.exit(0)
  })
}
