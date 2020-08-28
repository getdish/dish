import { Restaurant, findOne } from '@dish/graph'

import { main_db } from '../utils'
import { Self } from './Self'

async function one() {
  const restaurant = await findOne<Restaurant>('restaurant', {
    slug: process.env.SLUG || '',
  })
  if (restaurant) {
    const merger = new Self()
    await merger.mergeAll(restaurant.id)
  }
}

async function all() {
  const internal = new Self()
  await internal.runOnWorker('allForCity', ['San Francisco, CA'])
}

async function query() {
  const internal = new Self()
  if (!process.env.QUERY) return
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
