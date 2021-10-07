import '@dish/helpers/polyfill'

import { restaurantFindOne, restaurantUpdate } from '@dish/graph'
import { scrape_db } from '@dish/helpers-node'

import * as Google from '../src/google/one'
import * as Self from '../src/self/one'
import * as Tripadvisor from '../src/tripadvisor/one'
import * as Yelp from '../src/yelp/one'

export async function main(slug: string) {
  try {
    const rest = await restaurantFindOne({
      slug,
    })

    if (!rest) {
      console.log('No restaurant')
      return
    }

    console.log(
      'crawling restaurant',
      `${slug} ${rest.id} ${rest.name} ${rest.address} ${rest.telephone}`
    )

    // reset scrape_metadata so it redoes summary
    console.log('reset restaurant scrape metadata')
    rest.scrape_metadata = {
      ...rest.scrape_metadata,
      gpt_summary_updated_at: null,
    }
    await restaurantUpdate(rest)

    const skips = (process.env.SKIP ?? '').split(',')
    const shouldSkip = (str: string) => skips.includes(str)

    // clear existing scrapes
    if (rest.id && !shouldSkip('external') && !shouldSkip('scrapes')) {
      if (process.env.CLEAR_EXISTING === '1') {
        const res = await scrape_db.query(`DELETE FROM scrape WHERE restaurant_id = '${rest.id}';`)
        console.log('Deleted', res.rows)
      } else {
        console.log('To clear existing scrapes for restaurant set CLEAR_EXISTING=1')
      }
    }

    if (!shouldSkip('external')) {
      if (!shouldSkip('tripadvisor')) {
        try {
          await Tripadvisor.one(slug)
        } catch (err) {
          console.error(err)
        }
      }
      if (!shouldSkip('yelp')) {
        await Yelp.one(slug)
      }
      if (!shouldSkip('google')) {
        await Google.one(slug)
      }
    }

    if (!shouldSkip('internal')) {
      await Self.one(slug)
    }

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
