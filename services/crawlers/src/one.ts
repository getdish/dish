import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import * as Google from './google/one'
import * as Self from './self/one'
import * as Tripadvisor from './tripadvisor/one'
import * as Yelp from './yelp/one'

export async function main(slug: string) {
  try {
    const rest = await restaurantFindOne({
      slug,
    })
    console.log(
      'crawling restaurant',
      slug,
      rest?.name,
      rest?.address,
      rest?.telephone
    )
    await Tripadvisor.one(slug)
    await Yelp.one(slug)
    await Google.one(slug)
    await Self.one(slug)
    console.log('done!')
    process.exit(0)
  } catch (err) {
    console.error('error', err)
  }
}

const slug = process.env.SLUG ?? process.argv[process.argv.length - 1]

if (slug) {
  main(slug)
}

// for dev it should quit background jobs better
const cleanExit = () => {
  console.log('clean exit')
  process.exit(0)
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill
