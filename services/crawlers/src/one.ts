import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import * as Google from './google/one'
import * as Self from './self/one'
import * as Yelp from './yelp/one'

export async function main(slug: string) {
  try {
    const rest = await restaurantFindOne({
      slug,
    })
    console.log(
      'crawling restaurant',
      rest?.name,
      rest?.address,
      rest?.telephone
    )
    await Yelp.one(slug)
    await Google.one(slug)
    await Self.one(slug)
  } catch (err) {
    console.error('error', err)
  }
}

if (process.env.SLUG) {
  main(process.env.SLUG)
}
