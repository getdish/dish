import * as Doordash from '../crawlers/doordash/one'
import * as Google from '../crawlers/google/one'
import * as Grubhub from '../crawlers/grubhub/one'
import * as Infatuation from '../crawlers/infatuation/one'
import { removeScrapeForRestaurant } from '../crawlers/scrape-helpers'
import * as Self from '../crawlers/self/one'
import * as Tripadvisor from '../crawlers/tripadvisor/one'
import * as Yelp from '../crawlers/yelp/one'
import { restaurantFindOne, restaurantUpdate } from '@dish/graph'
import { scrape_db } from '@dish/helpers-node'
import '@dish/helpers/polyfill'

const skips = (process.env.SKIP ?? '').split(',').filter(Boolean)
let onlys = (process.env.ONLY ?? '').split(',').filter(Boolean)
if (onlys.some((x) => /yelp|google|doordash|grubhub|tripadvisor|infatuation/.test(x))) {
  onlys = [...new Set([...onlys, 'external'])]
}

const shouldSkip = (str: string) =>
  skips.includes(str) || (onlys.length ? !onlys.includes(str) : false)

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

    // clear existing scrapes
    if (rest.id && !shouldSkip('external') && !shouldSkip('scrapes')) {
      if (process.env.CLEAR_EXISTING === '1') {
        const res = await scrape_db.query(
          `DELETE FROM scrape WHERE restaurant_id = '${rest.id}';`
        )
        console.log('Deleted', res.rows)
      } else {
        console.log('To clear existing scrapes for restaurant set CLEAR_EXISTING=1')
      }
    }

    if (!shouldSkip('external')) {
      const externals = [
        { name: 'yelp', action: Yelp.one },
        { name: 'google', action: Google.one },
        { name: 'doordash', action: Doordash.one },
        { name: 'grubhub', action: Grubhub.one },
        { name: 'tripadvisor', action: Tripadvisor.one },
        { name: 'infatuation', action: Infatuation.one },
      ]
      for (const external of externals) {
        if (shouldSkip(external.name)) {
          console.log('skipping', external.name)
          continue
        }
        try {
          await removeScrapeForRestaurant(rest, external.name)
          await external.action(slug)
        } catch (err) {
          console.log('error running crawler', external.name, err.message)
          console.log(err.stack)
        }
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
