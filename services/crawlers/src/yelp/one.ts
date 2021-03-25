import '@dish/helpers/polyfill'

import { Yelp } from './Yelp'

export async function one(slug: string) {
  try {
    if (!slug) {
      throw new Error(`No slug`)
    }
    const yelp = new Yelp()
    yelp.run_all_on_main = true
    await yelp.crawlSingle(slug)
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
