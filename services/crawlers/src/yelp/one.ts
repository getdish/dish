import '@dish/helpers/polyfill'

import { restaurantFindOne } from '@dish/graph'

import { Yelp } from './Yelp'

export async function one(slug: string) {
  try {
    if (!slug) {
      throw new Error(`No slug`)
    }
    console.log('Finding', slug)
    const rest = await restaurantFindOne({
      slug,
    })
    if (!rest?.name) {
      console.warn('not found')
      return
    }
    const [lng, lat] = rest.location?.coordinates ?? []
    if (!lng || !lat) {
      throw new Error(`no lng or lat ${rest.location}`)
    }
    const yelp = new Yelp()
    yelp.run_all_on_main = true
    const mv = 0.001
    console.log('Yelp, getting restaurants')
    await yelp.getRestaurants(
      [lat - mv, lng - mv],
      [lat + mv, lng + mv],
      0,
      rest
    )
  } catch (err) {
    console.error('error', err)
  }
}

if (process.env.RUN) {
  console.log('running yelp')
  one(process.env.SLUG || '').then(() => {
    process.exit(0)
  })
}
